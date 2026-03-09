// Script to manually trigger matching for existing items
require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./src/models/Item');
const { findMatches } = require('./src/services/matchingService');

const triggerMatching = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Finding all active items...');
    const items = await Item.find({ status: 'active' }).sort('createdAt');
    console.log(`📦 Found ${items.length} active items\n`);

    if (items.length === 0) {
      console.log('❌ No active items to match');
      process.exit(0);
    }

    // Display items
    items.forEach((item, index) => {
      console.log(`${index + 1}. [${item.type.toUpperCase()}] ${item.title} (${item.category})`);
    });

    console.log('\n🚀 Starting matching process...\n');

    // Trigger matching for each item
    for (const item of items) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Processing: ${item.title} (${item.type})`);
      console.log('='.repeat(60));
      await findMatches(item);
    }

    console.log('\n✅ Matching process complete!');
    
    // Show results
    const Match = require('./src/models/Match');
    const matchCount = await Match.countDocuments();
    console.log(`\n📊 Total matches created: ${matchCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

triggerMatching();
