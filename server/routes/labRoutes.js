const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getLabTests, 
  addLabTest, 
  orderLabTest, 
  getLabOrders, 
  updateLabOrder 
} = require('../controllers/labController');

router.use(auth);

// Catalog routes
router.get('/tests', getLabTests);
router.post('/tests', authorize('admin'), addLabTest);

// Orders routes
router.get('/orders', getLabOrders);
router.post('/orders', authorize('doctor'), orderLabTest);
router.put('/orders/:id', authorize('admin', 'lab-technician'), updateLabOrder);

module.exports = router;
