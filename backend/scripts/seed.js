const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sqli_guardian';

async function main() {
  console.log('🔗 Connecting to MongoDB:', mongoUri);
  await mongoose.connect(mongoUri);
  console.log('✅ Connected');

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'admin123';

  const existing = await User.findOne({ username: adminUser.toLowerCase().trim() });

  if (existing) {
    console.log(`ℹ️  Admin user "${existing.username}" already exists — skipping.`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    const user = new User({
      username: adminUser.toLowerCase().trim(),
      passwordHash,
    });
    await user.save();
    console.log(`✅ Created admin user: ${user.username}`);
    console.log(`   Password: ${adminPass}`);
  }

  await mongoose.disconnect();
  console.log('🏁 Done — seed complete');
}

main().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
