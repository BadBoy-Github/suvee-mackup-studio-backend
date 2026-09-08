import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  image: {
    type: String
  },
  isHD: {
    type: Boolean,
    default: false
  },
  isTop: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
