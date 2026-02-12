import mongoose from 'mongoose';
import 'dotenv/config';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const collection = mongoose.connection.collection('attributes');
    const docs = await collection.find({ category: 'processors' }).limit(5).toArray();

    console.log('--- Sample Processors ---');
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
