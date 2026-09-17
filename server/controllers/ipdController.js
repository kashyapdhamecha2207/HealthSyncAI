const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const Admission = require('../models/Admission');

// Get all wards with their beds
exports.getWardsAndBeds = async (req, res) => {
  try {
    const wards = await Ward.find().lean();
    for (let ward of wards) {
      ward.beds = await Bed.find({ wardId: ward._id });
    }
    res.json(wards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin adds a new ward
exports.addWard = async (req, res) => {
  try {
    const ward = await Ward.create(req.body);
    // Optionally auto-generate beds based on capacity
    if (req.body.capacity) {
      const beds = [];
      for (let i = 1; i <= req.body.capacity; i++) {
        beds.push({
          wardId: ward._id,
          bedNumber: `${ward.name.substring(0,2).toUpperCase()}-${i}`,
          status: 'available'
        });
      }
      await Bed.insertMany(beds);
    }
    res.status(201).json(ward);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admit a patient to a bed
exports.admitPatient = async (req, res) => {
  try {
    const { patientId, attendingDoctorId, bedId, reasonForAdmission, expectedDischargeDate } = req.body;
    
    const bed = await Bed.findById(bedId);
    if (!bed || bed.status !== 'available') {
      return res.status(400).json({ message: 'Bed is not available' });
    }

    const admission = await Admission.create({
      patientId,
      attendingDoctorId,
      bedId,
      reasonForAdmission,
      expectedDischargeDate
    });

    bed.status = 'occupied';
    await bed.save();

    res.status(201).json(admission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Discharge a patient
exports.dischargePatient = async (req, res) => {
  try {
    const { dischargeSummary } = req.body;
    const admission = await Admission.findById(req.params.id);
    
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    if (admission.status === 'discharged') return res.status(400).json({ message: 'Patient already discharged' });

    admission.status = 'discharged';
    admission.dischargeDate = new Date();
    admission.dischargeSummary = dischargeSummary;
    await admission.save();

    const bed = await Bed.findById(admission.bedId);
    if (bed) {
      bed.status = 'cleaning'; // Needs cleaning before becoming available
      await bed.save();
    }

    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update bed status (e.g. from cleaning to available)
exports.updateBedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bed = await Bed.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(bed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
