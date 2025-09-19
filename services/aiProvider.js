// async function classifyIntent(lead, offer) {
//     if (USE_MOCK) return mockAiResponse(lead, offer);
//     return await callOpenAI(buildPrompt(lead, offer));
//   }
  
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_MOCK = !OPENAI_API_KEY;

function mockAiResponse(lead, offer) {
  const role = (lead.role || '').toLowerCase();
  const isDecision = ['ceo','founder','cto','head','vp','director'].some(k => role.includes(k));
  const industryMatch = (offer.ideal_use_cases || []).some(icp => (lead.industry || '').toLowerCase().includes(icp.toLowerCase()));
  let label = 'Low';
  if (isDecision && industryMatch) label = 'High';
  else if (isDecision || industryMatch) label = 'Medium';
  const explanation = `Mock reason: role="${lead.role}", industry="${lead.industry}", matchedICP=${industryMatch}`;
  return { label, explanation };
}

function buildPrompt(lead, offer) {
  return `You are a sales intent classifier. Given the offer and a prospect, classify the prospect's buying intent as exactly one of: High, Medium, Low.
Return your answer in this exact format:
Intent: <High|Medium|Low>
Explanation: <1-2 sentence explanation focusing on signals from role, company, industry, bio>

Offer:
Name: ${offer.name}
Value props: ${offer.value_props.join(', ')}
Ideal use cases / ICP: ${offer.ideal_use_cases.join(', ')}

Prospect:
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}
Industry: ${lead.industry}
Location: ${lead.location}
LinkedIn bio: ${lead.linkedin_bio || ''}

Short answer only.`;
}

async function callOpenAI(prompt) {
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const url = 'https://api.openai.com/v1/chat/completions';
  const resp = await axios.post(url, {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0
  }, {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const text = resp.data.choices?.[0]?.message?.content || '';
  const match = text.match(/(High|Medium|Low)/i);
  const label = match ? match[0][0].toUpperCase() + match[0].slice(1).toLowerCase() : 'Medium';
  const explanation = text.replace(/(Intent:)?\s*(High|Medium|Low)\s*[:\-]*\s*/i, '').trim();
  return { label, explanation };
}

async function classifyIntent(lead, offer) {
  if (USE_MOCK) return mockAiResponse(lead, offer);
  const prompt = buildPrompt(lead, offer);
  return await callOpenAI(prompt);
}

module.exports = { classifyIntent, buildPrompt };
