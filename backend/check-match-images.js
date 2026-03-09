const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load models
const Match = require('./src/models/Match');
const Item = require('./src/models/Item');
const User = require('./src/models/User');

async function checkMatchImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const matches = await Match.find()
      .populate('lostItem')
      .populate('foundItem')
      .populate('lostUser', 'name email')
      .populate('foundUser', 'name email');

    console.log(`\nFound ${matches.length} matches\n`);

    matches.forEach((match, index) => {
      console.log(`\n=== Match ${index + 1} ===`);
      console.log(`Match ID: ${match._id}`);
      console.log(`Match Score: ${(match.matchScore * 100).toFixed(0)}%`);
      console.log(`Status: ${match.status}`);
      
      console.log('\nLost Item:');
      console.log(`  Title: ${match.lostItem?.title || 'N/A'}`);
      console.log(`  Image URL: ${match.lostItem?.imageUrl || 'NO IMAGE'}`);
      console.log(`  Posted by: ${match.lostUser?.name || 'Unknown'}`);
      
      console.log('\nFound Item:');
      console.log(`  Title: ${match.foundItem?.title || 'N/A'}`);
      console.log(`  Image URL: ${match.foundItem?.imageUrl || 'NO IMAGE'}`);
      console.log(`  Posted by: ${match.foundUser?.name || 'Unknown'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMatchImages();
