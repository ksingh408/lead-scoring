const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  linkedin_bio: String,
  uploadId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
