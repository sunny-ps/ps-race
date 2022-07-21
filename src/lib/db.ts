import { MongoClient } from "mongodb";

let indexesCreated = false;
async function createIndexes(client: MongoClient) {
  if (indexesCreated) return client;
  const db = client.db();

  await db.collection("revenue").createIndex({ industry: 1 }, { unique: true });

  indexesCreated = true;
  return client;
}

export async function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  // @ts-ignore
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI!);
    // client.connect() returns an instance of MongoClient when resolved
    // @ts-ignore
    global.mongoClientPromise = client
      .connect()
      .then((client) => createIndexes(client));
  }
  // @ts-ignore
  return global.mongoClientPromise;
}

export async function getMongoDb(dbName: string) {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}
