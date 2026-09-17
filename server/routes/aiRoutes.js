const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkSymptoms } = require('../controllers/aiController');

router.use(auth);

// Patient AI routes
router.post('/symptom-checker', checkSymptoms);

module.exports = router;
