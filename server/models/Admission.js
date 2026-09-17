const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendingDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true
  },
  reasonForAdmission: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  expectedDischargeDate: { type: Date },
  dischargeDate: { type: Date },
  status: {
    type: String,
    enum: ['admitted', 'discharged', 'transferred'],
    default: 'admitted'
  },
  dischargeSummary: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Admission', AdmissionSchema);
