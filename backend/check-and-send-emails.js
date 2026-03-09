const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Match = require('./src/models/Match');
const Item = require('./src/models/Item');
const User = require('./src/models/User');
const { sendMatchNotifications } = require('./src/services/notificationService');

async function checkAndSendEmails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const matches = await Match.find()
      .populate('lostItem')
      .populate('foundItem')
      .populate('lostUser', 'name email')
      .populate('foundUser', 'name email');

    console.log(`Found ${matches.length} matches\n`);

    for (const match of matches) {
      console.log(`Match ${match._id}:`);
      console.log(`  Lost: ${match.lostItem?.title} by ${match.lostUser?.name}`);
      console.log(`  Found: ${match.foundItem?.title} by ${match.foundUser?.name}`);
      console.log(`  Score: ${(match.matchScore * 100).toFixed(0)}%`);
      console.log(`  Sending email notifications...`);
      
      try {
        await sendMatchNotifications(match);
        console.log(`  ✅ Emails sent successfully\n`);
      } catch (error) {
        console.log(`  ❌ Email error: ${error.message}\n`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAndSendEmails();
