const mongoose = require('mongoose');

const user = new mongoose.Schema({
  NAME: {
    type: String,
  },
  EMAIL: {
    type: String,
    unique: true,
  },
  UID: {
    type: String,
  },
  IMAGE_URL: {
		type: String,
  }
});

const posts = new mongoose.Schema({
  POST_ID: {
    type: String,
  },
  STATE: {
    type: String,
  },
  CITY: {
    type: String,
  },
  TITLE: {
    type: String,
  },
  DESCRIPTION: {
    type: String,
  },
  TIME_MS: {
    type: Number,
  },
  TIME_FORMATTED: {
    type: String,
  },
  NAME: {
    type: String,
  },
  EMAIL: {
    type: String,
  },
  IMAGE_URL: {
    type: String,
  },
  COMMENTS: {
    type: [{
      NAME: String,
      TIME_MS: Number,
      EMAIL: String,
      TIME_FORMATTED: String,
      PIC_URL: String,
      COMMENT_DESC: String
    }]
  }
})

module.exports.user = mongoose.model('user', user);
module.exports.posts = mongoose.model('posts', posts);