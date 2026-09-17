const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "General Ward A", "ICU 1"
  type: { 
    type: String, 
    enum: ['general', 'icu', 'private', 'maternity', 'pediatric'],
    default: 'general' 
  },
  floor: { type: String, required: true },
  capacity: { type: Number, required: true },
  basePricePerNight: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ward', WardSchema);
