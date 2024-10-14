require('dotenv').config();
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

// Configure the region
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create S3 service object
const s3 = new AWS.S3();

// Function to list objects in a specific S3 bucket
const listS3Objects = async () => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
        };

        const data = await s3.listObjectsV2(params).promise();
        console.log('S3 Objects:', data.Contents);
    } catch (error) {
        console.error('Error fetching S3 objects:', error);
    }
};

const s3Uploadv2 = async (fileName, buffer) => {

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}-${fileName}`,
        Body: buffer,
    };

    return await s3.upload(param).promise();
}

const deleteS3Document = async (fileKey) => {

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };

    const response = await s3.deleteObject(param).promise();
    return response;
}

const getS3Document = async (fileKey) => {
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };

    const response = await s3.getObject(param).promise();
    console.log('response ', response);
}


module.exports = {
    listS3Objects,
    s3Uploadv2,
    deleteS3Document,
    getS3Document
}

