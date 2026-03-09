const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Match = require('./src/models/Match');
const Item = require('./src/models/Item');

async function cleanupAndRematch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete matches with non-existent items
    const matches = await Match.find();
    console.log(`\nFound ${matches.length} matches`);
    
    for (const match of matches) {
      const lostItem = await Item.findById(match.lostItem);
      const foundItem = await Item.findById(match.foundItem);
      
      if (!lostItem || !foundItem) {
        console.log(`\nDeleting invalid match ${match._id}`);
        await Match.deleteOne({ _id: match._id });
      }
    }

    console.log('\n✅ Cleanup complete');
    
    // Now trigger matching for current items
    const items = await Item.find({ status: 'active' });
    console.log(`\nFound ${items.length} active items`);
    
    items.forEach(item => {
      console.log(`  - ${item.type}: ${item.title} (${item._id})`);
    });
    
    console.log('\n💡 To create new matches, run: node trigger-matching.js');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupAndRematch();
