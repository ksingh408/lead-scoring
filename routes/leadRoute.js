const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { uploadLeads } = require("../controllers/leadController");

router.post("/upload", upload.single("file"), uploadLeads);

module.exports = router;
