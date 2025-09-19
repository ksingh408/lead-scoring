// services/scoringRules.js
// Implements: Role relevance (decision=20, influencer=10), Industry match (exact=20, adjacent=10), Completeness=10
// Exports: computeRuleScore(lead, offer) => { total, breakdown }

function isEmpty(val) {
  return val === undefined || val === null || String(val).trim().length === 0;
}

function computeRoleScore(role) {
  if (!role) return 0;
  const r = role.toLowerCase();

  const decisionKeywords = [
    'ceo','founder','co-founder','cto','cfo','coo','head','vp','vice president',
    'director','owner','principal','president','managing director','chair','chief'
  ];

  const influencerKeywords = [
    'manager','lead','specialist','consultant','analyst','coordinator','executive','associate'
  ];

  if (decisionKeywords.some(k => r.includes(k))) return 20;
  if (influencerKeywords.some(k => r.includes(k))) return 10;
  return 0;
}



//-----------------------------------Industry scoring:

function computeIndustryScore(industry, icpList) {
  if (!industry || !icpList || !Array.isArray(icpList) || icpList.length === 0) return 0;
  const ind = industry.trim().toLowerCase();

  // --------------------------------exact equality check first
  for (const icp of icpList) {
    if (!icp) continue;
    if (ind === String(icp).trim().toLowerCase()) return 20;
  }

  // --------------------------------------adjacent: substring match either way
  for (const icp of icpList) {
    if (!icp) continue;
    const icpStr = String(icp).trim().toLowerCase();
    if (ind.includes(icpStr) || icpStr.includes(ind)) return 10;
  }

  return 0;
}


function completenessScore(lead) {
  const fields = ['name','role','company','industry','location','linkedin_bio'];
  const allPresent = fields.every(f => !isEmpty(lead[f]));
  return allPresent ? 10 : 0;
}


function computeRuleScore(lead, offer) {
    
  // offer.ideal_use_cases is expected to be an array of ICP strings
  const icpList = (offer && Array.isArray(offer.ideal_use_cases)) ? offer.ideal_use_cases : [];

  const rolePoints = computeRoleScore(lead.role);
  const industryPoints = computeIndustryScore(lead.industry, icpList);
  const completeness = completenessScore(lead);

  const total = rolePoints + industryPoints + completeness;
  const breakdown = {
    rolePoints,
    industryPoints,
    completeness
  };

  return { total, breakdown }; // total in range 0..50
}

module.exports = { computeRuleScore, computeRoleScore, computeIndustryScore, completenessScore };
