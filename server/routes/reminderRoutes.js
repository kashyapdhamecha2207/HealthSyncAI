const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getReminders, createReminder, toggleReminder, deleteReminder } = require('../controllers/reminderController');

router.use(auth);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.put('/:id/toggle', toggleReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
