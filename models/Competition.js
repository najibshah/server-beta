const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const CompetitionSchema = new Schema({
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
  entries: [
    {
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
      date: {
        type: Date,
        default: Date.now
      },
      entrypath: {
        type: String
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
      competitionID: {
        type: String
      }
    }
  ],
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  imagepath: {
    type: String
  },
  genre: {
    type: String
  }
});

module.exports = Competition = mongoose.model("competition", CompetitionSchema);
