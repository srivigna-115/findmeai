const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Item = require('./src/models/Item');
const User = require('./src/models/User');

async function checkItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const items = await Item.find().populate('user', 'name email');
    
    console.log(`\nFound ${items.length} items:\n`);
    items.forEach((item, index) => {
      console.log(`\n=== Item ${index + 1} ===`);
      console.log(`Type: ${item.type}`);
      console.log(`Title: ${item.title}`);
      console.log(`Category: ${item.category}`);
      console.log(`Image URL: ${item.imageUrl || 'NO IMAGE'}`);
      console.log(`Posted by: ${item.user?.name || 'Unknown'}`);
      console.log(`Status: ${item.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkItems();
