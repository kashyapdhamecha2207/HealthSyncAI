const Reminder = require('../models/Reminder');
const { sendEmail } = require('../services/emailService');
const User = require('../models/User');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const formatted = reminders.map(r => {
      const obj = r.toObject();
      obj.id = obj._id.toString();
      return obj;
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { title, message, time, frequency, type, date } = req.body;
    
    const reminder = await Reminder.create({
      userId: req.user.id,
      title,
      message,
      time,
      frequency,
      type,
      date,
      active: true
    });

    const obj = reminder.toObject();
    obj.id = obj._id.toString();

    // Send confirmation email
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: `Reminder Created: ${title}`,
          html: `<p>You have successfully scheduled a new reminder:</p>
                 <ul>
                   <li><strong>Title:</strong> ${title}</li>
                   <li><strong>Time:</strong> ${time}</li>
                   <li><strong>Frequency:</strong> ${frequency}</li>
                   <li><strong>Message:</strong> ${message}</li>
                 </ul>`
        });
      }
    } catch(err) {
      console.error('Failed to send reminder confirmation email:', err);
    }

    res.status(201).json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Not found' });
    
    reminder.active = !reminder.active;
    await reminder.save();
    
    const obj = reminder.toObject();
    obj.id = obj._id.toString();
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Not found' });
    
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
