const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Item = require('./src/models/Item');

async function checkItemDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const items = await Item.find();
    
    items.forEach((item, index) => {
      console.log(`=== Item ${index + 1} ===`);
      console.log(`ID: ${item._id}`);
      console.log(`Type: ${item.type}`);
      console.log(`Title: ${item.title}`);
      console.log(`Description: ${item.description}`);
      console.log(`Category: ${item.category}`);
      console.log(`Image URL: ${item.imageUrl || 'NO IMAGE'}`);
      console.log(`Has Image Embedding: ${!!item.imageEmbedding}`);
      console.log(`Status: ${item.status}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkItemDetails();
