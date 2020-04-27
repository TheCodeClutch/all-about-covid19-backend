const router = require("express").Router();

router.get( '/', (request, response) => {
	response.status(200).json({
		message : "API is live and currently functional"
	}) 
})

router.get( '/team', (request, response) => {
	response.status(200).json({
		message : "The project is built by Nikhil and Shreya"
	})
})

module.exports = router;