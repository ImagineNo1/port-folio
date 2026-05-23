import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise = null;

function createClientPromise() {
  if (!uri) return null;
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getMongoClient() {
  if (!clientPromise) clientPromise = createClientPromise();
  if (!clientPromise) return null;
  return clientPromise;
}

export function isMongoConfigured() {
  return Boolean(uri);
}
