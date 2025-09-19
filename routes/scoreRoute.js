const express = require('express');
const router = express.Router();
const { runScoring, getResults,exportResultsCSV } = require('../controllers/scoreController');

router.post('/:uploadId', runScoring);
router.get('/results', getResults);
router.get('/exportCSV',exportResultsCSV)

module.exports = router;
