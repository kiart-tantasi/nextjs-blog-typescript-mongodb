import { Db } from "mongodb";
import getPresignedUrl from "./presigned-url";

import { Article, ArticleCard } from "../interfaces/article";

export const transformCardData = async (array: Article[], db: Db): Promise<ArticleCard[]> => {
    const justCreatedPresignedUrl: { [key: string]: string } = {};
    const result = [];

    for (let idx = 0; idx < array.length; idx++) {
        const x = array[idx];
        let imgUrl = x.img;

        // 1. IF PRIVATE BUCKET
        if (x.img.includes("https://privatepetchdotblog.s3.ap-southeast-1.amazonaws.com")) {
            const key: string = x.img.slice(60);
            const presignedUrlCollection = db.collection("presignedUrl");
            const result = await presignedUrlCollection.findOne({ key: key });
            const justCreatedImgUrl = justCreatedPresignedUrl[key];

            // 1.1 USE IMG URL THAT WAS JUST CREATED FROM PREVIOUS LOOPS (DUPLICATE IMG)
            if (justCreatedImgUrl) {
                imgUrl = justCreatedImgUrl;
            }

            // 1.2 PRESIGNED URL EXISTS AND DOES NOT EXPIRE
            else if (result && result.age > new Date().getTime() - (5 * 60 * 1000)) {
                imgUrl = result.url;
            }

            // 1.3 PRESIGNED URL DOES NOT EXIST OR ALREADY EXPIRED
            else {
                const newPresignedUrl = getPresignedUrl(key);
                const dataToInsertOrUpdate = {
                    key: key,
                    url: newPresignedUrl,
                    age: new Date().getTime() + 3_600_000
                }
                // 1.3.1 DOES NOT EXIST, INSERT
                if (!result) await presignedUrlCollection.insertOne(dataToInsertOrUpdate);

                //1.3.2 EXPIRED, UPDATE
                else if (result.age) await presignedUrlCollection.updateOne({ key: key }, dataToInsertOrUpdate);

                imgUrl = newPresignedUrl;
                justCreatedPresignedUrl[key] = newPresignedUrl;
            }

            // LAST STEP: USE TRANSFER ACCELERATION IF IT IS IN LAST 2 INDEXES
            if (idx >= array.length - 2 && imgUrl !== x.img) {
                let params = imgUrl.slice(60);
                imgUrl = "https://privatepetchdotblog.s3-accelerate.amazonaws.com/" + params;
            }
        }

        // 2. IF PUBLIC BUCKET AND IT IS IN LAST 2 INDEXES
        else if (idx >= array.length - 2 && x.img.includes("https://petchdotblog.s3.ap-southeast-1.amazonaws.com"))
            imgUrl = "https://petchdotblog.s3-accelerate.amazonaws.com" + x.img.slice(52);

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

        // 1.1 PRESIGNED URL EXISTS AND DOES NOT EXPIRE
        if (result && result.age > new Date().getTime() - (5 * 60 * 1000)) {
            imgUrl = result.url;
        }

        // 1.2 PRESIGNED URL DOES NOT EXIST OR ALREADY EXPIRED
        else {
            const newPresignedUrl = getPresignedUrl(key);
            const dataToInsertOrUpdate = {
                key: key,
                url: newPresignedUrl,
                age: new Date().getTime() + 3_600_000
            }
            // 1.2.1 DOES NOT EXIST, INSERT
            if (!result) await presignedUrlCollection.insertOne(dataToInsertOrUpdate);

            //1.2.2 EXPIRED, UPDATE
            else if (result.age) await presignedUrlCollection.updateOne({ key: key }, dataToInsertOrUpdate);

            // set url
            imgUrl = newPresignedUrl;
        }

        // LAST STEP: INDEX >= 1, transfer acceleration
        if (accelerate === true && imgUrl !== originalImgUrl) {
            let tempParams = imgUrl.slice(60);
            imgUrl = "https://privatepetchdotblog.s3-accelerate.amazonaws.com/" + tempParams;
        }
    }
    
    // PUBLUC BUCKET
    else if (accelerate === true && imgUrl.includes("https://petchdotblog.s3.ap-southeast-1.amazonaws.com")) {
        const tempParams = imgUrl.slice(52);
        imgUrl = "https://petchdotblog.s3-accelerate.amazonaws.com" + tempParams;
    }

    return imgUrl;
}