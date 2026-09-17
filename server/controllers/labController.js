const LabTest = require('../models/LabTest');
const LabResult = require('../models/LabResult');
const User = require('../models/User');

// Get catalog of all available tests
exports.getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.find({ isActive: true }).sort({ name: 1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin adds a new test to the catalog
exports.addLabTest = async (req, res) => {
  try {
    const test = await LabTest.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor orders a test for a patient
exports.orderLabTest = async (req, res) => {
  try {
    const { patientId, testId, notes } = req.body;
    
    const order = await LabResult.create({
      patientId,
      doctorId: req.user.id,
      testId,
      notes,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Lab Technician or Doctor gets lab orders
exports.getLabOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user.id;
    }
    // Technician and Admin see all orders

    const orders = await LabResult.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name')
      .populate('testId')
      .populate('medicalRecordId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Technician updates the status (e.g., to completed with results)
exports.updateLabOrder = async (req, res) => {
  try {
    const { status, results, medicalRecordId } = req.body;
    
    const updateData = {
      status,
      results,
      technicianId: req.user.id
    };

    if (medicalRecordId) updateData.medicalRecordId = medicalRecordId;
    if (status === 'completed') updateData.completedAt = new Date();

    const order = await LabResult.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('testId').populate('patientId', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
