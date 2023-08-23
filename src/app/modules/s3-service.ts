import AWS from "aws-sdk";

AWS.config.update({
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
});

const s3 = new AWS.S3();
const S3_BUCKET = "notices-poc-bucket";

const uploadToS3 = async (fileName: string, metadata: any, data: any) => {
    const params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: data,
        Metadata: metadata,
        ContentType: "application/pdf",
        // ACL: "public-read", // doesnt work with bucket settings
    };

    const result = await s3.upload(params).promise();
    console.log(`PDF generated and uploaded to: ${result.Location}`);

    return result.Location;
};

const exists = async (objectKey: string): Promise<boolean> => {
    try {
        await s3
            .headObject({
                Bucket: S3_BUCKET,
                Key: objectKey,
            })
            .promise();
        return true;
    } catch (error: any) {
        if (error.code === "NotFound") {
            return false;
        }
        throw error;
    }
};

const downloadFile = async (objectKey: string) => {
    const data = await s3
        .getObject({
            Bucket: S3_BUCKET,
            Key: objectKey,
        })
        .promise();
    return data;
};

export { uploadToS3, exists, downloadFile };
