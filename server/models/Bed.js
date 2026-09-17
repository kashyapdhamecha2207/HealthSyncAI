const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  wardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  bedNumber: { type: String, required: true }, // e.g. "A-12"
  status: {
    type: String,
    enum: ['available', 'occupied', 'cleaning', 'maintenance'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
