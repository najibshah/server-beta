const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//multer
const multer = require("multer");
const multerpath = require("path");
//Specify storage for local server upload of videos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "client/src/useruploads/");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      Date.now() + "VideoUpload" + multerpath.extname(file.originalname)
    ); //Multer Extension workaround
  }
});
const upload = multer({ storage: storage });
var videopath1 = "";
var stro = "";
var vslice = "";

//Video model
const Video = require("../../models/Video");
// Profile model
const Profile = require("../../models/Profile");

// Validation
const validateVideoInput = require("../../validation/video");
const validateCommentInput = require("../../validation/comment");

// @route   GET api/upload/test
// @desc    Tests Upload Route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Upload Works" }));

// @route   GET api/videos
// @desc    Get videos
// @access  Public
router.get("/", (req, res) => {
  Video.find()
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});

// //GET VIDEOS BY Profile ROUTES
// router.get("/profile/:id", (req, res) => {
//   Video.find({ user: req.profile.user })
//     .sort({ date: -1 })
//     .then(videos => res.json(videos))
//     .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
// });

//GET VIDEOS BY GENRE ROUTES

// @route   GET api/videos/genrehorror
// @desc    Get videos by genre : HORROR
// @access  Public
router.get("/genrehorror", (req, res) => {
  Video.find({ genre: "Horror" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genrecomedy
// @desc    Get videos by genre : COMEDY
// @access  Public
router.get("/genrecomedy", (req, res) => {
  Video.find({ genre: "Comedy" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genrescifi
// @desc    Get videos by genre : SCIFI
// @access  Public
router.get("/genrescifi", (req, res) => {
  Video.find({ genre: "Sci-Fi" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genredocumentary
// @desc    Get videos by genre : SCIFI
// @access  Public
router.get("/genredocumentary", (req, res) => {
  Video.find({ genre: "Documentary" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genrethriller
// @desc    Get videos by genre : THRILLER
// @access  Public
router.get("/genrethriller", (req, res) => {
  Video.find({ genre: "Thriller" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genresuspense
// @desc    Get videos by genre : SUSPENSE
// @access  Public
router.get("/genresuspense", (req, res) => {
  Video.find({ genre: "Suspense" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});
// @route   GET api/videos/genreromcom
// @desc    Get videos by genre : ROMCOM
// @access  Public
router.get("/genreromcom", (req, res) => {
  Video.find({ genre: "Romantic Comedy" })
    .sort({ date: -1 })
    .then(videos => res.json(videos))
    .catch(err => res.status(404).json({ novideosfound: "No videos found" }));
});

// @route   GET api/videos/:id
// @desc    Get video by id
// @access  Public
router.get("/:id", (req, res) => {
  Video.findById(req.params.id)
    .then(video => {
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ novideofound: "No video found with that ID" });
      }
    })
    .catch(err =>
      res.status(404).json({ novideofound: "No video found with that ID" })
    );
});

// @route   GET api/videos
// @desc    Tests upload route
// @access  Public
router.get("/", (req, res) => res.send("REACHED"));

// @route   POST api/videos/upload
// @desc    upload new video to server
// @access  Public
router.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  // videopath1 = req.file.path;
  stro = req.file.path;
  vslice = stro.slice(23);
  videopath1 = vslice;
  console.log(videopath1);

  res.send("Now click submit button");
});

// @route   POST api/videos/uploadBACK
// @desc    upload new video POST to server
// @access  Public
router.post(
  "/uploadBACK",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateVideoInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newVideo = new Video({
      description: req.body.description,
      title: req.body.title,
      videopath: videopath1,
      genre: req.body.genre,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newVideo.save().then(video => res.json(video));
  }
);

// @route   DELETE api/videos/:id
// @desc    Delete video
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Video.findById(req.params.id)
        .then(video => {
          // Check for video owner
          if (video.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          video.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ videonotfound: "No video found" })
        );
    });
  }
);

// @route   POST api/videos/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Video.findById(req.params.id)
        .then(video => {
          if (
            video.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this video" });
          }

          // Add user id to likes array
          video.likes.unshift({ user: req.user.id });

          video.save().then(video => res.json(video));
        })
        .catch(err =>
          res.status(404).json({ videonotfound: "No video found" })
        );
    });
  }
);

// @route   POST api/videos/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Video.findById(req.params.id)
        .then(video => {
          if (
            video.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this video" });
          }

          // Get remove index
          const removeIndex = video.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          video.likes.splice(removeIndex, 1);

          // Save
          video.save().then(video => res.json(video));
        })
        .catch(err =>
          res.status(404).json({ videonotfound: "No video found" })
        );
    });
  }
);

// @route   POST api/videos/comment/:id
// @desc    Add comment to video
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

    Video.findById(req.params.id)
      .then(video => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        video.comments.unshift(newComment);

        // Save
        video.save().then(video => res.json(video));
      })
      .catch(err => res.status(404).json({ videonotfound: "No video found" }));
  }
);

// @route   DELETE api/videos/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Video.findById(req.params.id)
      .then(video => {
        // Check to see if comment exists
        if (
          video.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = video.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        video.comments.splice(removeIndex, 1);

        video.save().then(video => res.json(video));
      })
      .catch(err => res.status(404).json({ videonotfound: "No video found" }));
  }
);

module.exports = router;
