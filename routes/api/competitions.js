const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Competition Model
const Competition = require("../../models/Competition");
// Profile model
const Profile = require("../../models/Profile");

// Validation
const validateCompetitionInput = require("../../validation/competition");
// Validation
const validateEntryInput = require("../../validation/entry");
const validateCommentInput = require("../../validation/comment");

// @route   GET api/competitions/test
// @desc    Tests Competitions Route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "competitions Works" }));

//multer
const multer = require("multer");
const multerpath = require("path");
//Specify storage for local server upload of competition image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "client/src/compimg/");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      Date.now() + "CompImageUpload" + multerpath.extname(file.originalname)
    ); //Multer Extension workaround
  }
});
const upload = multer({ storage: storage });
var imagepath1 = "";
var stro = "";
var vslice = "";

//C O M P E T I T I O N  E N T R Y
//CODE FOR ENTRY UPLOAD
//multer for entry
const multerEntry = require("multer");
const multerEntryPath = require("path");
//Specify storage for local server upload of competition entry video
const storageEntry = multerEntry.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "client/src/compEntry/");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      Date.now() +
        "CompEntryUpload" +
        multerEntryPath.extname(file.originalname)
    ); //Multer Extension workaround
  }
});
const uploadEntry = multerEntry({ storage: storageEntry });
var entryPath1 = "";
var stroEntry = "";
var vsliceEntry = "";

// @route   GET api/competitions
// @desc    Get competitions
// @access  Public
router.get("/", (req, res) => {
  Competition.find()
    .sort({ date: -1 })
    .then(competitions => res.json(competitions))
    .catch(err =>
      res.status(404).json({ nocompetitionsfound: "No competitions found" })
    );
});

// @route   GET api/competitions/:id
// @desc    Get competitions by id
// @access  Public
router.get("/:id", (req, res) => {
  Competition.findById(req.params.id)
    .then(competition => {
      if (competition) {
        res.json(competition);
      } else {
        res
          .status(404)
          .json({ nocompetitionfound: "No competition found with that ID" });
      }
    })
    .catch(err =>
      res
        .status(404)
        .json({ nocompetitionfound: "No competition found with that ID" })
    );
});

// @route   POST api/competitions/upload
// @desc    upload new competition image to server
// @access  Public
router.post("/upload", upload.single("file"), (req, res) => {
  // console.log(req.file.path);
  // imagepath1 = req.file.path;
  stro = req.file.path;
  vslice = stro.slice(19);
  imagepath1 = vslice;
  console.log(imagepath1);
  res.send("Now click submit button");
});

// @route   POST api/competitions/uploadBACK
// @desc    upload new competition POST to server
// @access  Public
router.post(
  "/uploadBACK",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCompetitionInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    // fstr = req.body.from;
    // fslice = fstr.slice(0, 8);
    // compeFrom = fslice;
    console.log(req.body.from);
    const newCompetition = new Competition({
      description: req.body.description,
      title: req.body.title,
      imagepath: imagepath1,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newCompetition.save().then(competition => res.json(competition));
  }
);

//C O M P E T I T I O N  E N T R Y
//CODE FOR ENTRY UPLOAD
//route for entry
// @route   POST api/videos/upload
// @desc    upload new entry to server
// @access  Public
router.post("/uploadEntry", uploadEntry.single("file"), (req, res) => {
  stroEntry = req.file.path;
  vsliceEntry = stroEntry.slice(21);
  entryPath1 = vsliceEntry;
  console.log(entryPath1);
  console.log(req.file.path);

  res.send("Now click submit button");
});

// @route   POST api/competitions/entry/:id
// @desc    Submit Entry to competition
// @access  Private
router.post(
  "/entry/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEntryInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Competition.findById(req.params.id)
      .then(competition => {
        const newEntry = {
          description: req.body.description,
          title: req.body.title,
          entrypath: entryPath1,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
          competitionID: req.params.id
        };

        // Add to entries array
        competition.entries.unshift(newEntry);

        // Save
        competition.save().then(competition => res.json(competition));
      })
      .catch(err =>
        res.status(404).json({ competitionnotfound: "No competitions found" })
      );
  }
);

// @route   DELETE api/competitions/:id
// @desc    Delete competition
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Competition.findById(req.params.id)
        .then(competition => {
          // Check for competition owner
          if (competition.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          competition.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ competitionnotfound: "No competition found" })
        );
    });
  }
);

// @route   POST api/competitions/comment/:id
// @desc    Add comment to competition
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Competition.findById(req.params.id)
      .then(competition => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        competition.comments.unshift(newComment);

        // Save
        competition.save().then(competition => res.json(competition));
      })
      .catch(err =>
        res.status(404).json({ competitionnotfound: "No competitions found" })
      );
  }
);
// @route   DELETE api/competitions/comment/:id/:comment_id
// @desc    Remove comment from competition
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Competition.findById(req.params.id)
      .then(competition => {
        // Check to see if comment exists
        if (
          competition.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = competition.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        competition.comments.splice(removeIndex, 1);

        competition.save().then(competition => res.json(competition));
      })
      .catch(err =>
        res.status(404).json({ competitionnotfound: "No competition found" })
      );
  }
);

module.exports = router;
