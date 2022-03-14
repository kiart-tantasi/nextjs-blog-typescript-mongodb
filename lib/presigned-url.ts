import AWS from "aws-sdk";

const getPresignedUrl = (key: string) => {
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: "ap-southeast-1"
    });
    const s3 = new AWS.S3();
    const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Expires: 60 * 60
    });

    return url;
}

export default getPresignedUrl;




