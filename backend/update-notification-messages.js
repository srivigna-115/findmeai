require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');
const Match = require('./src/models/Match');
const User = require('./src/models/User');
const Item = require('./src/models/Item');

const updateNotificationMessages = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all notifications
    const notifications = await Notification.find({ type: 'match' })
      .populate('user', 'name email');

    console.log(`📊 Found ${notifications.length} match notifications\n`);

    let updated = 0;

    for (const notif of notifications) {
      // Extract chatRoomId from link
      const chatRoomId = notif.link?.split('/chat/')[1];
      
      if (!chatRoomId) {
        console.log(`⚠️  Skipping notification ${notif._id} - no chat room ID`);
        continue;
      }

      // Find the match
      const match = await Match.findOne({ chatRoomId })
        .populate('lostItem')
        .populate('foundItem')
        .populate('lostUser', 'name')
        .populate('foundUser', 'name');

      if (!match) {
        console.log(`⚠️  Skipping notification ${notif._id} - match not found`);
        continue;
      }

      // Determine if this user is the lost or found user
      const isLostUser = match.lostUser._id.toString() === notif.user._id.toString();
      
      let newTitle = '🎉 Match Found!';
      let newMessage;

      if (isLostUser) {
        newMessage = `We found a potential match for your lost "${match.lostItem?.title || 'item'}"! Match score: ${(match.matchScore * 100).toFixed(0)}%. Click to start chatting with ${match.foundUser?.name || 'the finder'}.`;
      } else {
        newMessage = `Your found "${match.foundItem?.title || 'item'}" matches ${match.lostUser?.name || 'someone'}'s lost item! Match score: ${(match.matchScore * 100).toFixed(0)}%. Click to start chatting.`;
      }

      // Update notification
      await Notification.findByIdAndUpdate(notif._id, {
        title: newTitle,
        message: newMessage
      });

      console.log(`✅ Updated notification for ${notif.user.name}`);
      console.log(`   Old: "${notif.message}"`);
      console.log(`   New: "${newMessage}"\n`);
      updated++;
    }

    console.log('='.repeat(50));
    console.log(`📊 Updated ${updated} notifications`);
    console.log('='.repeat(50));
    console.log('\n✅ Done!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateNotificationMessages();
