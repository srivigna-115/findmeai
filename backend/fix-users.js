const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Item = require('./src/models/Item');
  const User = require('./src/models/User');

  // Find items with no user
  const items = await Item.find({ user: null });
  console.log('Items with no user:', items.length);

  if (items.length > 0) {
    // Get first user to assign
    const user = await User.findOne({});
    if (user) {
      console.log('Assigning to user:', user.name, user.email);
      await Item.updateMany({ user: null }, { user: user._id });
      console.log('Fixed!');
    } else {
      console.log('No users found in DB');
    }
  }

  // Show all items with users
  const allItems = await Item.find({}).populate('user', 'name email');
  allItems.forEach(i => {
    console.log(i.type, '|', i.title, '| user:', i.user ? i.user.name : 'NULL');
  });

  mongoose.disconnect();
});
