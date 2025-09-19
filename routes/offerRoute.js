const express = require("express");
const router = express.Router();
const { setOffer } = require("../controllers/offerController");

router.post("/", setOffer);

module.exports = router;
