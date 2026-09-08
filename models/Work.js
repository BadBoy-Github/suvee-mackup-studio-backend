import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  photos: {
    type: [String]
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Work = mongoose.model('Work', workSchema);
export default Work;
