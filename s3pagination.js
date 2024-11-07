async function listS3Objects(continuationToken) {
    const params = {
        Bucket: bucketName,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken // Use this for pagination
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        
        // Process the retrieved objects
        data.Contents.forEach((object) => {
            console.log(object.Key); // Print the object key
        });

        // Check if there are more objects to fetch
        if (data.IsTruncated) {
            // Call the function again with the next continuation token
            await listS3Objects(data.NextContinuationToken);
        } else {
            console.log('No more objects to retrieve.');
        }
    } catch (error) {
        console.error('Error retrieving S3 objects:', error);
    }
}
