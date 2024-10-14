const fs = require('fs');
const path = require('path');
const { s3Uploadv2 } = require('./s3Services');

// Function to upload file to S3
const uploadFile = async () => {

    const filePath = path.join(__dirname, 'sql.pdf');

    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const response = await s3Uploadv2(fileName, fileContent);
    return response.Key;
}

module.exports = {
    uploadFile
}
