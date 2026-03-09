const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const Match = require('./src/models/Match');
const Item = require('./src/models/Item');
const { sendMatchNotifications } = require('./src/services/notificationService');

async function createBottleMatch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find the bottle items
    const foundBottle = await Item.findOne({ 
      title: /milton.*bottle/i, 
      type: 'found',
      status: 'active'
    }).populate('user');
    
    const lostBottle = await Item.findOne({ 
      title: /milton.*bottle/i, 
      type: 'lost',
      status: 'active'
    }).populate('user');

    if (!foundBottle || !lostBottle) {
      console.log('Could not find both bottle items');
      console.log('Found bottle:', !!foundBottle);
      console.log('Lost bottle:', !!lostBottle);
      process.exit(1);
    }

    console.log('Creating match between:');
    console.log(`  Found: ${foundBottle.title} by ${foundBottle.user.name}`);
    console.log(`  Lost: ${lostBottle.title} by ${lostBottle.user.name}`);

    const chatRoomId = uuidv4();

    const match = await Match.create({
      lostItem: lostBottle._id,
      foundItem: foundBottle._id,
      lostUser: lostBottle.user._id,
      foundUser: foundBottle.user._id,
      matchScore: 0.95,
      matchType: 'text',
      chatRoomId,
      status: 'pending'
    });

    console.log(`\n✅ Match created: ${match._id}`);

    // Update item statuses
    await Item.findByIdAndUpdate(lostBottle._id, { status: 'matched' });
    await Item.findByIdAndUpdate(foundBottle._id, { status: 'matched' });

    console.log('✅ Item statuses updated');

    // Send email notifications
    console.log('\n📧 Sending email notifications...');
    await sendMatchNotifications(match);
    console.log('✅ Emails sent successfully!');

    console.log('\n🎉 Match created and emails sent!');
    console.log('Check your inbox for notifications.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createBottleMatch();
