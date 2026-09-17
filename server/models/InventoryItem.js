const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['medicine', 'consumable', 'equipment'],
    default: 'medicine' 
  },
  manufacturer: { type: String },
  batchNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  unitPrice: { type: Number, required: true },
  stockQuantity: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 20 },
  location: { type: String } // e.g., "Shelf A", "Storage Room B"
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
