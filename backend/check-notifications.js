require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');

const checkNotifications = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find().select('name email');
    console.log(`📊 Found ${users.length} users:\n`);

    for (const user of users) {
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      console.log(`   ID: ${user._id}`);
      
      const notifications = await Notification.find({ user: user._id })
        .sort('-createdAt');
      
      console.log(`   📬 Notifications: ${notifications.length}`);
      
      if (notifications.length > 0) {
        notifications.forEach((notif, index) => {
          console.log(`\n   ${index + 1}. ${notif.title}`);
          console.log(`      Message: ${notif.message}`);
          console.log(`      Type: ${notif.type}`);
          console.log(`      Read: ${notif.read ? '✅' : '❌'}`);
          console.log(`      Created: ${notif.createdAt}`);
          console.log(`      Link: ${notif.link || 'N/A'}`);
        });
      } else {
        console.log('   ⚠️  No notifications found for this user');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkNotifications();
