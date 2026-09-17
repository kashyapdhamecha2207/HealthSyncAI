const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getWardsAndBeds, 
  addWard, 
  admitPatient, 
  dischargePatient,
  updateBedStatus
} = require('../controllers/ipdController');

router.use(auth);

// All these routes usually require admin or doctor level privileges
router.get('/wards', getWardsAndBeds);
router.post('/wards', authorize('admin'), addWard);

router.post('/admissions', authorize('admin', 'doctor'), admitPatient);
router.put('/admissions/:id/discharge', authorize('admin', 'doctor'), dischargePatient);

router.put('/beds/:id/status', authorize('admin', 'doctor'), updateBedStatus);

module.exports = router;
