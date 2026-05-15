const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const Project = mongoose.models.Project || mongoose.model('Project', new mongoose.Schema({}, { strict: false }));

  const projects = await Project.find({});

  console.log('Projects Star Ratings:', projects.map(p => ({ 
    id: p._id, 
    orderId: p.orderId, 
    developer: p.developer?.name,
    star: p.star,
    status: p.orderStatus
  })));

  process.exit();
}

checkData();
