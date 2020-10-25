const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const VideoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
    //not populated like usual so if user deletes account the post stays there.
    //so usefull information is not lost
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  videopath: {
    type: String
  },
  genre: {
    type: String
  }
});

module.exports = Video = mongoose.model("video", VideoSchema);
