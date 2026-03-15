require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');

const hideMessageContent = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all message notifications
    const notifications = await Notification.find({ type: 'message' })
      .populate('user', 'name email');

    console.log(`📊 Found ${notifications.length} message notifications\n`);

    if (notifications.length === 0) {
      console.log('✅ No message notifications to update');
      process.exit(0);
    }

    let updated = 0;

    for (const notif of notifications) {
      // Extract sender name from the old message
      // Old format: "Ashritha Posani sent you a message: 'hello'"
      // New format: "You have a new message from Ashritha Posani. Click to view the chat."
      
      let senderName = 'someone';
      
      // Try to extract sender name from message
      const match = notif.message.match(/^(.+?) sent you a message:/);
      if (match) {
        senderName = match[1];
      }

      const newMessage = `You have a new message from ${senderName}. Click to view the chat.`;

      await Notification.findByIdAndUpdate(notif._id, {
        message: newMessage
      });

      console.log(`✅ Updated notification for ${notif.user.name}`);
      console.log(`   Old: "${notif.message}"`);
      console.log(`   New: "${newMessage}"\n`);
      updated++;
    }

    console.log('='.repeat(50));
    console.log(`📊 Updated ${updated} message notifications`);
    console.log('🔒 Message content is now hidden in notifications');
    console.log('='.repeat(50));
    console.log('\n✅ Done!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

hideMessageContent();
