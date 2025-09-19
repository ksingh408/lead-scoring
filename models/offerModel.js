const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value_props: [{ type: String, required: true }],
  ideal_use_cases: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', OfferSchema);
