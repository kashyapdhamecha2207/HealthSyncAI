const InventoryItem = require('../models/InventoryItem');
const Prescription = require('../models/Prescription');

exports.getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dispense medicines from pharmacy based on a prescription
exports.dispensePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.body;
    
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    
    if (prescription.status === 'dispensed') {
      return res.status(400).json({ message: 'Prescription already dispensed' });
    }

    // Process each medicine and deduct from inventory
    for (let med of prescription.medicines) {
      if (med.inventoryItemId) {
        const item = await InventoryItem.findById(med.inventoryItemId);
        if (item && item.stockQuantity >= med.quantityProvided) {
          item.stockQuantity -= med.quantityProvided;
          await item.save();
        } else {
          return res.status(400).json({ 
            message: `Insufficient stock for ${item ? item.name : 'Unknown Medicine'}` 
          });
        }
      }
    }

    prescription.status = 'dispensed';
    prescription.dispensedDate = new Date();
    await prescription.save();

    res.json({ message: 'Prescription dispensed successfully and inventory updated', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
