import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

export const dbConnect = async () => {
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  try {
    let client = new MongoClient(uri, options);
    const clientPromise = client.connect();
    await clientPromise;
    return clientPromise;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to MongoDB");
  }
};
