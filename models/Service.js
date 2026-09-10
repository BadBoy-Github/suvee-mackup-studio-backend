import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  incl: {
    type: String
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
