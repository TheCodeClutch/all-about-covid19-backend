const router = require('express').Router();
// const User = require('../Models/model.js').user;
const middleware = require('../Helpers/auth-middleware').session;

// to get the list users who have shared their to-do-list
router.get('/getAPIkey', middleware, (request, response) => {
	response.status(200).json({
    email: request.decode.email,
    expiry: request.decode.expiry
  })
})

module.exports = router;