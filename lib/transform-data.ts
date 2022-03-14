import { Db } from "mongodb";
import AWS from "aws-sdk";

import { Article, ArticleCard } from "../interfaces/article";

export const transformCardData = async (array: Article[], db: Db): Promise<ArticleCard[]> => {
    const result = [];
    const secondArticleIdx = array.length - 2;

    for (let idx = 0; idx < array.length; idx++) {
        const x = array[idx];
        let imgUrl = await transformImgUrl(x.img, db, (idx >= secondArticleIdx));

        result.push({
            _id: x._id?.toString() || Math.random().toString(),
            title: x.title,
            desc: x.desc,
            img: imgUrl,
            alt: x.alt,
            date: x.date,
            category: x.category,
            slug: x.slug,
        });
    }
    return result;
};

export const transformImgUrl = async(imgUrl: string, db: Db, accelerate: boolean) => {

    // 1. IF PRIVATE BUCKET
    if (imgUrl.includes("https://privatepetchdotblog.s3.ap-southeast-1.amazonaws.com")) {
        const originalImgUrl = imgUrl;
        const key: string = imgUrl.slice(60);
        const presignedUrlCollection = db.collection("presignedUrl");
        const result = await presignedUrlCollection.findOne({ key: key });
        const deadline = (result)? result.age - (5 * 60 * 1000): null;
        const now = new Date().getTime();

        // 1.1 PRESIGNED URL EXISTS AND DOES NOT EXPIRE
        if (result && deadline && deadline > now) {
            imgUrl = result.url;
        }
        
        // 1.2 PRESIGNED URL DOES NOT EXIST OR ALREADY EXPIRED
        else {
            // CREATE NEW PRESIGNED URL (AWS SDK)
            AWS.config.update({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: "ap-southeast-1"
            });
            const s3 = new AWS.S3();
            let newPresignedUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.BUCKET_NAME,
                Key: key,
                Expires: 60 * 60
            });
            const newPresignedUrlData = {
                key: key,
                url: newPresignedUrl,
                age: new Date().getTime() + 3_600_000
            }

            // 1.2.1 IF DOES NOT EXIST, INSERT
            if (!result) await presignedUrlCollection.insertOne(newPresignedUrlData);

            //1.2.2 IF EXPIRED, REPLACE
            else if (deadline && deadline <= now) await presignedUrlCollection.replaceOne({ key: key }, newPresignedUrlData);

            imgUrl = newPresignedUrl;
        }

        // If Transfer Acceleration
        if (accelerate === true && imgUrl !== originalImgUrl) {
            let tempParams = imgUrl.slice(60);
            imgUrl = "https://privatepetchdotblog.s3-accelerate.amazonaws.com/" + tempParams;
        }
    }
    
    // 2. IF PUBLIC BUCKET (and If Transfer Acceleration)
    else if (accelerate === true && imgUrl.includes("https://petchdotblog.s3.ap-southeast-1.amazonaws.com")) {
        const tempParams = imgUrl.slice(52);
        imgUrl = "https://petchdotblog.s3-accelerate.amazonaws.com" + tempParams;
    }

    return imgUrl;
}