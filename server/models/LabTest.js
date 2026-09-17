const mongoose = require('mongoose');

const LabTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['blood', 'urine', 'imaging', 'genetic', 'pathology', 'other'],
    default: 'blood' 
  },
  description: { type: String },
  price: { type: Number, required: true },
  turnaroundTime: { type: String, default: '24 hours' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LabTest', LabTestSchema);
