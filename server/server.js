const express = require('express'); // trigger restart
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const opdRoutes = require('./routes/opdRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const caregiverRoutes = require('./routes/caregiverRoutes');
const refillRoutes = require('./routes/refillRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const billingRoutes = require('./routes/billingRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const labRoutes = require('./routes/labRoutes');
const ipdRoutes = require('./routes/ipdRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Mount routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opd', opdRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/refills', refillRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/ipd', ipdRoutes);
app.use('/api/ai', aiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('HealthSync AI+ API is running...');
});

const PORT = process.env.PORT || 5000;

// Initialize email service
const { verifyEmailConfig, sendEmail } = require('./services/emailService');
const cron = require('node-cron');
const Reminder = require('./models/Reminder');
const User = require('./models/User');

// Schedule automated reminder emails every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Find active reminders for the current time
    const dueReminders = await Reminder.find({ active: true, time: currentTime });
    
    for (const reminder of dueReminders) {
      const user = await User.findById(reminder.userId);
      if (user) {
        await sendEmail({
          to: user.email,
          subject: `⏰ Reminder: ${reminder.title}`,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                  <h2 style="color: #ea580c;">HealthSync AI Reminder</h2>
                  <p>Hello ${user.name}, this is your scheduled reminder:</p>
                  <div style="background-color: #fff7ed; padding: 15px; border-left: 4px solid #ea580c; margin: 20px 0; border-radius: 4px;">
                    <h3 style="margin-top:0;">${reminder.title}</h3>
                    <p>${reminder.message}</p>
                  </div>
                </div>`
        });
        console.log(`[Cron] Sent reminder email to ${user.email} for "${reminder.title}"`);
        
        if (reminder.frequency === 'once') {
          reminder.active = false;
          await reminder.save();
        }
      }
    }
  } catch (error) {
    console.error('[Cron] Reminder job error:', error);
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Verify email configuration
  const emailConfigured = await verifyEmailConfig();
  if (!emailConfigured) {
    console.log('⚠️  Email service not configured. Please set GMAIL_EMAIL and GMAIL_APP_PASSWORD in .env file');
  }
});
