require('dotenv').config();
const createConnection = require('./rabbitmqcon');
const { connectDB, db, ObjectId } = require('./mongoCon');
const { uploadFile } = require('./upload2S3');

async function subscribe(queue) {
    const { connection, channel } = await createConnection(process.env.CLOUDMQ_URL);
    await channel.assertQueue(queue, { durable: true });

    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            console.log(`Message received from queue ${queue}`);
            const { results, lastPage, id } = JSON.parse(`${msg.content.toString()}`);
            // console.log('data -> ', results, lastPage, id);
            console.log('last page ', lastPage);
            await connectDB();

            let collection = await db.collection("dumpCollection");

            if (results && results.length > 0) {
                const ids = results.map(result => result.inventory_id);

                // Check for existing documents with the given IDs
                const existingDocs = await collection.find({ inventory_id: { $in: ids } }).toArray();
                if (existingDocs.length > 0) {
                    console.log(`Documents with IDs ${existingDocs.map(doc => doc.inventory_id).join(', ')} already exist.`);
                }

                // write s3 logic to upload and get the id of each and update the object
                // and insert into db

                for (let i = 0; i < results.length; i++) {
                    results[i]['s3Key'] = await uploadFile();
                }

                // Perform bulk update
                const bulkOps = results.map(result => ({
                    updateOne: {
                        filter: { inventory_id: result.inventory_id },
                        update: { $set: result },
                        upsert: true // Create if not exists
                    }
                }));

                const resOut = await collection.bulkWrite(bulkOps);
                console.log('result ==> ', resOut);
            }

            let updateCollection = await db.collection("keepTrack");
            const updateResult = await updateCollection.updateOne({ _id: new ObjectId(id) }, { $set: { lastPage: lastPage } }, { upsert: true });
            console.log('Updated documents =>', updateResult);

            channel.ack(msg); // Acknowledge the message
        }
    });
}

// Example usage
subscribe('test_queue');
