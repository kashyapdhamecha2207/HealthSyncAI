const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  dispensePrescription 
} = require('../controllers/inventoryController');

// All routes require auth and admin privileges
router.use(auth);
router.use(authorize('admin'));

router.route('/')
  .get(getInventory)
  .post(addInventoryItem);

router.put('/:id', updateInventoryItem);

router.post('/prescriptions/dispense', dispensePrescription);

module.exports = router;
