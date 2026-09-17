// db/models/Order.js
const mongoose = require('mongoose');

// Order items are stored as a snapshot (name/price/image at time of purchase),
// so an order's history stays accurate even if the product is later edited or deleted.
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  qty: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, default: 'Processing' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('Order', orderSchema);
