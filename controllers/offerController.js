const Offer = require('../models/offerModel')

exports.setOffer = async (req, res) => {
  const { name, value_props, ideal_use_cases } = req.body;

  if (!name || !value_props || !ideal_use_cases) {
    return res.status(400).json({ error: 'name, value_props, and ideal_use_cases required' });
  }

  try {
    const offer = new Offer({ name, value_props, ideal_use_cases });
    await offer.save();
    res.json({ message: 'Offer saved', offer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save offer' });
  }
};
