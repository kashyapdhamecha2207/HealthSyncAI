const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// @desc    Get all medical records for the logged-in patient
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    // Return records WITHOUT the large fileData field for listing
    const records = await MedicalRecord.find({ patientId: req.user.id })
      .select('-fileData')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error('Get Medical Records Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload a medical record
// @route   POST /api/medical-records
// @access  Private (Patient)
exports.uploadMedicalRecord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // 10 MB limit
    if (size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }

    const record = await MedicalRecord.create({
      patientId: req.user.id,
      fileName: `${Date.now()}-${originalname}`,
      originalName: originalname,
      mimeType: mimetype,
      fileSize: size,
      fileData: buffer.toString('base64')
    });

    // Return without file data
    const response = record.toObject();
    delete response.fileData;

    res.status(201).json(response);

    // Background email dispatch
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: 'New Medical Record Uploaded',
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                  <h2 style="color: #0f172a;">HealthSync AI Notification</h2>
                  <p>A new medical record <strong>${originalname}</strong> has been successfully uploaded to your account.</p>
                  <p>Thank you for keeping your health profile up to date.</p>
                </div>`
        });
      }
    } catch(emailErr) {
      console.error('Failed to send upload notification email:', emailErr);
    }
  } catch (error) {
    console.error('Upload Medical Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download a medical record (original file)
// @route   GET /api/medical-records/:id/download
// @access  Private
exports.downloadMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      patientId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const fileBuffer = Buffer.from(record.fileData, 'base64');

    // Sanitize filename to prevent header corruption
    const safeFileName = encodeURIComponent(record.originalName || 'document');
    
    res.set({
      'Content-Type': record.mimeType,
      'Content-Disposition': `attachment; filename="${safeFileName}"`,
      'Content-Length': fileBuffer.length
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error('Download Medical Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a medical record
// @route   DELETE /api/medical-records/:id
// @access  Private
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOneAndDelete({
      _id: req.params.id,
      patientId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete Medical Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get complete health timeline for the logged-in patient
// @route   GET /api/medical-records/timeline
// @access  Private
exports.getHealthTimeline = async (req, res) => {
  try {
    const patientId = req.user.id;
    
    // Fetch records, appointments, and medications
    const records = await MedicalRecord.find({ patientId }).select('-fileData');
    const appointments = await Appointment.find({ patientId }).populate('doctorId', 'name');
    const medications = await Medication.find({ patientId });

    // Format events for the timeline
    const timeline = [];

    records.forEach(record => {
      timeline.push({
        id: record._id.toString(),
        date: record.createdAt.toISOString().split('T')[0],
        type: 'lab-result',
        title: record.originalName,
        description: 'Uploaded medical document',
        status: 'completed',
        timestamp: new Date(record.createdAt).getTime()
      });
    });

    appointments.forEach(apt => {
      timeline.push({
        id: apt._id.toString(),
        date: new Date(apt.date).toISOString().split('T')[0],
        type: 'appointment',
        title: 'Doctor Appointment',
        description: `Appointment with Dr. ${apt.doctorId?.name || 'Doctor'} - ${apt.reason || 'Checkup'}`,
        status: apt.status,
        timestamp: new Date(apt.date).getTime()
      });
    });

    medications.forEach(med => {
      timeline.push({
        id: med._id.toString(),
        date: med.createdAt.toISOString().split('T')[0],
        type: 'medication',
        title: `Prescribed: ${med.name}`,
        description: `${med.dosage} - ${med.frequency}`,
        status: 'active',
        timestamp: new Date(med.createdAt).getTime()
      });
    });

    // Sort by most recent
    timeline.sort((a, b) => b.timestamp - a.timestamp);

    res.json(timeline);
  } catch (error) {
    console.error('Get Health Timeline Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
