const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Match = require('./src/models/Match');
const Item = require('./src/models/Item');

async function checkMatchDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const matches = await Match.find();
    
    console.log(`\nFound ${matches.length} matches\n`);

    for (const match of matches) {
      console.log(`\n=== Match ${match._id} ===`);
      console.log(`Lost Item ID: ${match.lostItem}`);
      console.log(`Found Item ID: ${match.foundItem}`);
      
      // Check if items exist
      const lostItem = await Item.findById(match.lostItem);
      const foundItem = await Item.findById(match.foundItem);
      
      console.log(`\nLost Item exists: ${!!lostItem}`);
      if (lostItem) {
        console.log(`  Title: ${lostItem.title}`);
        console.log(`  Image: ${lostItem.imageUrl || 'NO IMAGE'}`);
      }
      
      console.log(`\nFound Item exists: ${!!foundItem}`);
      if (foundItem) {
        console.log(`  Title: ${foundItem.title}`);
        console.log(`  Image: ${foundItem.imageUrl || 'NO IMAGE'}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMatchDetails();
