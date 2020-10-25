const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Entry Model
const Entry = require("../../models/Entry");
//Competition Model
const Competition = require("../../models/Competition");
// Profile model
const Profile = require("../../models/Profile");

// Validation
const validateEntryInput = require("../../validation/entry");

//@desc CODE FOR ENTRY-UPLOAD STORAGE
//@desc multer for entry
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

// @route   GET api/entries/test
// @desc    Tests Entries Route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "entries" }));

// @route   GET api/entries/:id
// @desc    Get entries for competition by Id
// @access  Public
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Entry.find({ competitionID: req.params.id })
      .sort({ date: -1 })
      .then(entries => res.json(entries))
      .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
  }
);

// @route   GET api/entries/:id
// @desc    Get entries for competition by Id
// @access  Public
router.get(
  "/likesort/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Entry.find({ competitionID: req.params.id })
      .sort({ likes: -1 })
      .then(entries => res.json(entries))
      .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
  }
);

// // @route   GET api/entries/:id
// // @desc    Get entries for results sorted by likes
// // @access  Public
// router.get(
//   "/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Entry.find({ competitionID: req.params.id })
//       .sort({ likes: { $size: -1 } })
//       .then(entries => res.json(entries))
//       .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
//   }
// );

// @route   GET api/entries/entry/:id/
// @desc    Get single entry by ID for competition
// @access  Public
router.get(
  "/entry/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Entry.findById(req.params.id)
      .then(entry => {
        if (entry) {
          res.json(entry);
        } else {
          res.status(404).json({ novideofound: "No entry found with that ID" });
        }
      })
      .catch(err =>
        res.status(404).json({ noentryfound: "No entry found with that ID" })
      );
  }
);

// @route   POST api/entries/upload
// @desc    upload new entry post to server
// @access  Public
router.post("/uploadEntry", uploadEntry.single("file"), (req, res) => {
  stroEntry = req.file.path;
  vsliceEntry = stroEntry.slice(21);
  entryPath1 = vsliceEntry;
  console.log(entryPath1);
  console.log(req.file.path);

  res.send("Now click submit button");
});

// // APPEND ENTRIES TO PARENT COMPETITION
// // @route   POST api/entries/entry/:id
// // @desc    Submit Entry to competition
// // @access  Private
// router.post(
//   "/postEntry/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const { errors, isValid } = validateEntryInput(req.body);

//     // Check Validation
//     if (!isValid) {
//       // If any errors, send 400 with errors object
//       return res.status(400).json(errors);
//     }

//     Competition.findById(req.params.id)
//       .then(competition => {
//         const newEntry = {
//           description: req.body.description,
//           title: req.body.title,
//           entrypath: entryPath1,
//           name: req.body.name,
//           avatar: req.body.avatar,
//           user: req.user.id
//         };

//         // Add to entries array
//         competition.entries.unshift(newEntry);

//         // Save
//         competition.save().then(competition => res.json(competition));
//       })
//       .catch(err =>
//         res.status(404).json({ competitionnotfound: "No competitions found" })
//       );
//   }
// );

// APPEND COMP-ID TO ENTRIES
// @route   POST api/entries/entry/:id
// @desc    Submit Entry to competition
// @access  Private
router.post(
  "/postEntry/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEntryInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newEntry = new Entry({
      description: req.body.description,
      title: req.body.title,
      entrypath: entryPath1,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
      competitionID: req.params.id
    });

    newEntry.save().then(entry => res.json(entry));
  }
);

// @route   DELETE api/entries/entry/:entry_id
// @desc    Remove entry from competition
// @access  Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Entry.findById(req.params.id)
      .then(entry => {
        // Check for entry owner
        if (entry.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        entry.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ noentryfound: "No entry found with that ID" })
      );
  }
);

// @route   LIKE api/entries/like/:id/
// @desc    Add Like to entry
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Entry.findById(req.params.id)
        .then(entry => {
          if (
            entry.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this entry" });
          }
          // Add user id to likes array
          entry.likes.unshift({ user: req.user.id });

          entry.save().then(entry => res.json(entry));
        })
        .catch(err =>
          res.status(404).json({ entrynotfound: "No entry found" })
        );
    });
  }
);

// @route   LIKE api/entries/unlike/:id/
// @desc    Add Like to entry
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Entry.findById(req.params.id)
        .then(entry => {
          if (
            entry.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this entry" });
          }
          // Get remove index
          const removeIndex = entry.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          entry.likes.splice(removeIndex, 1);

          // Save
          entry.save().then(entry => res.json(entry));
        })
        .catch(err =>
          res.status(404).json({ entrynotfound: "No entry found" })
        );
    });
  }
);

module.exports = router;
