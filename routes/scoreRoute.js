const express = require('express');
const router = express.Router();
const { runScoring, getResults } = require('../controllers/scoreController');

router.post('/:uploadId', runScoring);
router.get('/results', getResults);

module.exports = router;
