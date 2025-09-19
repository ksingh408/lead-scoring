const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  uploadId: { type: String, required: true },
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  linkedin_bio: String,
  intent: String,
  score: Number,
  reasoning: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
