const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const Match = require('./src/models/Match');
const Item = require('./src/models/Item');
const User = require('./src/models/User');

async function createManualMatch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const items = await Item.find({ status: 'active' }).populate('user');
    
    if (items.length < 2) {
      console.log('Need at least 2 items to create a match');
      process.exit(1);
    }

    const lostItem = items.find(i => i.type === 'lost');
    const foundItem = items.find(i => i.type === 'found');

    if (!lostItem || !foundItem) {
      console.log('Need both lost and found items');
      process.exit(1);
    }

    console.log('Creating match between:');
    console.log(`  Lost: ${lostItem.title} (${lostItem.user.name})`);
    console.log(`  Found: ${foundItem.title} (${foundItem.user.name})`);

    const chatRoomId = uuidv4();

    const match = await Match.create({
      lostItem: lostItem._id,
      foundItem: foundItem._id,
      lostUser: lostItem.user._id,
      foundUser: foundItem.user._id,
      matchScore: 1.0,
      matchType: 'text',
      chatRoomId,
      status: 'pending'
    });

    console.log(`\n✅ Match created: ${match._id}`);
    console.log(`Chat Room ID: ${chatRoomId}`);

    // Update item statuses
    await Item.findByIdAndUpdate(lostItem._id, { status: 'matched' });
    await Item.findByIdAndUpdate(foundItem._id, { status: 'matched' });

    console.log('\n✅ Item statuses updated');
    console.log('\nNow refresh the Matches page to see the match with images!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createManualMatch();
