import mongoose from 'mongoose';
import 'dotenv/config'; // Loads .env file
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjust path to .env if necessary, but 'dotenv/config' usually handles root .env if run from root.
// If run from api/src/scripts, .env is in ../../.env

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const collection = mongoose.connection.collection('attributes');
    const docs = await collection.find({}).limit(10).toArray();

    console.log('--- Sample Attributes ---');
    docs.forEach(doc => {
      console.log(JSON.stringify(doc, null, 2));
    });

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
