const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const URI = process.env.MONGO_URL;
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}


// connectDB()

db = client.db("dump");
// let collection = await db.collection("dumpCollection");
// const indexName = await collection.createIndex({ inventory_id: 1 }, { unique: true }); // 1 for ascending, -1 for descending
// console.log(`Index created: ${indexName}`);

module.exports = {
  connectDB,
  db,
  ObjectId
}