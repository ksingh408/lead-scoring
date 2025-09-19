const Lead = require('../models/leadModel');
const Offer = require('../models/offerModel');
const Result = require('../models/resultModel');
const { computeRuleScore } = require('../services/scoringRules');
const { classifyIntent } = require('../services/aiProvider');

async function mapAiPoints(label) {
  if (label === 'High') return 50;
  if (label === 'Medium') return 30;
  return 10;
}

exports.runScoring = async (req, res) => {

  try {
    const lastOffer = await Offer.findOne().sort({ createdAt: -1 });
    if (!lastOffer) return res.status(400).json({ error: 'No offer found. POST /offer first.' });

    const leads = await Lead.find({}); // or filter by uploadId if needed
    if (!leads.length) return res.status(400).json({ error: 'No leads found. Upload via /leads/upload first.' });

    const results = [];

    for (const lead of leads) {

      const rule = computeRuleScore(lead, lastOffer);
      let ai;
      try {
        ai = await classifyIntent(lead, lastOffer);
      } catch (err) {
        console.error('AI error', err.message);
        ai = { label: 'Medium', explanation: 'AI failed; defaulting to Medium' };
      }


      const aiPoints = await mapAiPoints(ai.label);
      const totalScore = Math.min(100, rule.total + aiPoints);

      const reasoning = `Rule: role(${rule.breakdown.rolePoints}) + industry(${rule.breakdown.industryPoints}) + completeness(${rule.breakdown.completeness}) = ${rule.total}. AI: ${ai.label} (${aiPoints}) — ${ai.explanation}`;

      const result = new Result({
        uploadId: lead.uploadId,
        name: lead.name,
        role: lead.role,
        company: lead.company,
        industry: lead.industry,
        location: lead.location,
        linkedin_bio: lead.linkedin_bio,
        intent: ai.label,
        score: totalScore,
        reasoning
      });

      await result.save();
      results.push(result);
    }

    res.json({ message: 'Scoring complete', count: results.length, resultsEndpoint: '/results' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scoring failed', details: err.message });
  }
};

exports.getResults = async (req, res) => {
  const results = await Result.find({});
  res.json(results);
};

exports.exportResultsCSV = async (req, res) => {
    try {
      const results = await Result.find({}).lean(); // lean() for plain JS objects
  
      if (!results.length) return res.status(400).json({ error: 'No results to export' });
  
      const fields = ['name','role','company','industry','location','linkedin_bio','intent','score','reasoning'];
      const parser = new Parser({ fields });
      const csv = parser.parse(results);
  
      res.header('Content-Type', 'text/csv');
      res.attachment('lead_scoring_results.csv');
      return res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'CSV export failed', details: err.message });
    }
  };
