const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getInvoices, 
  createInvoice, 
  updateInvoiceStatus, 
  makePayment 
} = require('../controllers/billingController');

router.use(auth);

// Patient and Admin can view invoices
router.get('/invoices', getInvoices);

// Patient can make payments
router.post('/payments', makePayment);

// Admin only routes
router.post('/invoices', authorize('admin'), createInvoice);
router.put('/invoices/:id/status', authorize('admin'), updateInvoiceStatus);

module.exports = router;
