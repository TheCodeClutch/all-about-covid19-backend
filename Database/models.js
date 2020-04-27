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
		default: 'To be provided'
  }
});

module.exports.user = mongoose.model('user', user);