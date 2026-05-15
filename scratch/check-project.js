const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function checkProject() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Project = mongoose.model('Project', new mongoose.Schema({ 
      clientName: String, 
      orderId: String, 
      developer: { id: mongoose.Schema.Types.ObjectId, name: String },
      createdBy: mongoose.Schema.Types.ObjectId
    }));
    const project = await Project.findOne({ clientName: 'timbryant78' });
    console.log(JSON.stringify(project, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkProject();
