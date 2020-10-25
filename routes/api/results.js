const express = require("express");
const router = express.Router();

// @route   GET api/entries/test
// @desc    Tests Entries Route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "results works" }));

module.exports = router;
