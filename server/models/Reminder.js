const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['appointment', 'medication', 'custom'],
    default: 'custom'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true }, // Format: "HH:MM"
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    default: 'once'
  },
  active: { type: Boolean, default: true },
  date: { type: String } // Format: "YYYY-MM-DD"
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);
