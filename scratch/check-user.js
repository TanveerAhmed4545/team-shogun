const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({ name: String, role: String }));
    const users = await User.find({ name: /Fahid/i });
    console.log(JSON.stringify(users, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkUser();
