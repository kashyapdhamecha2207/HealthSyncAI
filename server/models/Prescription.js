const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  medicines: [{
    inventoryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem'
    },
    medicineName: String, // fallback if not from inventory
    dosage: String,
    frequency: String,
    duration: String,
    quantityProvided: { type: Number, default: 0 } // Amount dispensed from pharmacy
  }],
  notes: { type: String },
  status: {
    type: String,
    enum: ['prescribed', 'partially_dispensed', 'dispensed'],
    default: 'prescribed'
  },
  dispensedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
