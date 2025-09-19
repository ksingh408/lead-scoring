const Lead = require('../models/leadModel');
const { parseCsvBuffer } = require('../services/csvParserService');
const { v4: uuidv4 } = require('uuid');

exports.uploadLeads = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file required (field name: file)' });
  }

  try {
    const leadsData = parseCsvBuffer(req.file.buffer);
    const uploadId = uuidv4();

    const leads = leadsData.map(lead => ({ ...lead, uploadId }));
    await Lead.insertMany(leads);

    res.json({ message: 'Leads uploaded', uploadId, count: leads.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload leads', details: err.message });
  }
};
