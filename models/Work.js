import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  groomName: {
    type: String,
    required: true
  },
  brideName: {
    type: String,
    required: true
  },
  img1: {
    type: String
  },
  img2: {
    type: String
  },
  img3: {
    type: String
  },
  img4: {
    type: String
  }
}, { timestamps: true });

const Work = mongoose.model('Work', workSchema);
export default Work;
