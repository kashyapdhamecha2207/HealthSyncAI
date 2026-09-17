const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

exports.getInvoices = async (req, res) => {
  try {
    let query = {};
    // If the user is a patient, only show their invoices
    if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    }
    
    const invoices = await Invoice.find(query)
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { patientId, appointmentId, prescriptionId, items, tax, discount, dueDate } = req.body;
    
    // Calculate subTotal and totalAmount
    let subTotal = 0;
    if (items && items.length > 0) {
      items.forEach(item => {
        subTotal += (item.quantity * item.unitPrice);
      });
    }

    const totalAmount = subTotal + (tax || 0) - (discount || 0);

    const invoice = await Invoice.create({
      patientId,
      appointmentId,
      prescriptionId,
      items,
      subTotal,
      tax: tax || 0,
      discount: discount || 0,
      totalAmount,
      dueDate,
      status: 'pending'
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.makePayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod } = req.body;
    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    // Mocking Payment Gateway (Stripe/Razorpay) success for now
    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payment = await Payment.create({
      invoiceId,
      patientId: req.user.id,
      amount,
      paymentMethod,
      transactionId,
      status: 'success'
    });

    // Update invoice status if fully paid
    // In a real scenario, we'd sum all payments. For simplicity, assume full payment.
    invoice.status = 'paid';
    await invoice.save();

    res.status(201).json({ payment, invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
