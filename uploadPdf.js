require('dotenv').config();

const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

// Connection string (replace with your own connection string)
const connectionString = process.env.CONNECTION_STRING;

// Name of the container in Blob Storage
const containerName = process.env.CONTAINER_NAME;

// Path to the PDF file to upload
// const filePath = path.join(__dirname, 'your-file.pdf');
const filePath = path.join(__dirname, 'sql.pdf');

// Name of the blob (file) in Azure Blob Storage
const blobName = 'sql-02.pdf';


async function uploadFileToBlob() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);

    // Read the PDF file as a stream
    const fileStream = fs.createReadStream(filePath);

    try {
        const uploadBlobResponse = await blobClient.uploadStream(fileStream);
        console.log(`Upload successful! Blob "${blobName}" uploaded with response code:`, uploadBlobResponse._response.status);
    } catch (err) {
        console.error("Error uploading file to Azure Blob Storage:", err);
    }
}

uploadFileToBlob()