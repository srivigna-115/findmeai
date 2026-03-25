const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Item = require('./src/models/Item');
  const Match = require('./src/models/Match');
  const { findMatches } = require('./src/services/matchingService');

  // Delete ALL matches
  await Match.deleteMany({});
  console.log('✅ Cleared all matches');

  // Reset all items to active
  await Item.updateMany({}, { status: 'active', matchedWith: null, matchScore: null });
  console.log('✅ Reset all items to active');

  // Trigger fresh matching for all items
  const items = await Item.find({ status: 'active' }).populate('user', '_id name email');
  console.log('Triggering matching for', items.length, 'items');

  for (const item of items) {
    try {
      await findMatches(item);
    } catch (err) {
      console.error('Match error for', item.title, ':', err.message);
    }
  }

  console.log('Done!');
  mongoose.disconnect();
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});
