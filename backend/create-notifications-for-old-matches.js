require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('./src/models/Match');
const Notification = require('./src/models/Notification');
const Item = require('./src/models/Item');
const User = require('./src/models/User');

const createNotificationsForOldMatches = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Find all matches
    const matches = await Match.find()
      .populate('lostItem')
      .populate('foundItem')
      .populate('lostUser', 'name email')
      .populate('foundUser', 'name email');

    console.log(`📊 Found ${matches.length} total matches\n`);

    if (matches.length === 0) {
      console.log('❌ No matches found in database');
      process.exit(0);
    }

    let created = 0;
    let skipped = 0;

    for (const match of matches) {
      console.log(`\n📝 Processing match: ${match._id}`);
      console.log(`   Lost: ${match.lostItem?.title || 'N/A'} (by ${match.lostUser?.name || 'Unknown'})`);
      console.log(`   Found: ${match.foundItem?.title || 'N/A'} (by ${match.foundUser?.name || 'Unknown'})`);
      console.log(`   Score: ${(match.matchScore * 100).toFixed(0)}%`);

      const chatLink = `/chat/${match.chatRoomId}`;

      // Check if notifications already exist for this match
      const existingNotifications = await Notification.find({
        'data.matchId': match._id
      });

      if (existingNotifications.length > 0) {
        console.log(`   ⏭️  Notifications already exist (${existingNotifications.length}), skipping...`);
        skipped++;
        continue;
      }

      // Create notifications for both users
      try {
        const notifications = await Promise.all([
          Notification.create({
            user: match.lostUser._id,
            type: 'match',
            title: '🎉 Match Found!',
            message: `We found a potential match for your lost "${match.lostItem?.title || 'item'}"! Match score: ${(match.matchScore * 100).toFixed(0)}%. Click to start chatting with ${match.foundUser?.name || 'the finder'}.`,
            link: chatLink,
            data: { matchId: match._id, chatRoomId: match.chatRoomId },
            read: false
          }),
          Notification.create({
            user: match.foundUser._id,
            type: 'match',
            title: '🎉 Match Found!',
            message: `Your found "${match.foundItem?.title || 'item'}" matches ${match.lostUser?.name || 'someone'}'s lost item! Match score: ${(match.matchScore * 100).toFixed(0)}%. Click to start chatting.`,
            link: chatLink,
            data: { matchId: match._id, chatRoomId: match.chatRoomId },
            read: false
          })
        ]);

        console.log(`   ✅ Created ${notifications.length} notifications`);
        created += notifications.length;
      } catch (error) {
        console.log(`   ❌ Error creating notifications: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total matches processed: ${matches.length}`);
    console.log(`Notifications created: ${created}`);
    console.log(`Matches skipped (already had notifications): ${skipped / 2}`);
    console.log('='.repeat(50));
    console.log('\n✅ Done! All old matches now have notifications.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createNotificationsForOldMatches();
