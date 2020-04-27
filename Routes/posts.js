
const router = require("express").Router();
const Posts = require('../Database/models').posts;
const middleware = require('../Helpers/auth-middleware').session;

router.post('/saveposts', middleware, (req, res) => {
	let newPost = new Posts({
		POST_ID: req.body.title + req.body.time_ms,
		STATE: req.body.state,
		CITY: req.body.city,
		TITLE: req.body.title,
		DESCRIPTION: req.body.description,
		TIME_MS: req.body.time_ms,
		TIME_FORMATTED: req.body.time_formatted,
		NAME: req.decode.name,
		EMAIL: req.decode.email,
		IMAGE_URL: req.decode.pic,
		COMMENTS: []
	})

	newPost.save()
		.then(responseDB => {
			res.json({
				msg: "Sucessfully posted request"
			})
		})
		.catch(err => {
			if (err.code === 11000) {
				res.json({
					msg: "You cannot post multiple requests, delete previous request, then post a new one"
				})
			} else {
				res.json({
					err
				})
			}
		})
})

router.post('/savecomment', middleware, (req, res) => {
	let data = {
		NAME: req.decode.name,
		TIME_MS: req.body.time_ms,
		EMAIL: req.decode.email,
		TIME_FORMATTED: req.body.time_formatted,
		PIC_URL: req.decode.pic,
		COMMENT_DESC: req.body.description
	}
	Posts.update({ POST_ID: req.body.post_id }, { $push: { COMMENTS: data } })
		.then(responseDB => {
			res.json({
				responseDB
			})
		})
		.catch(err => {
			res.json({
				err
			})
		})
})

router.post('/getposts', (req, res) => {
	Posts.find({STATE: req.body.state, CITY: req.body.city}, function(err, docs) {
    if (!err) { 
        res.json({
					docs
				})
    }
    else {
        res.json({
					err
				})
    }
});
})

router.post('/removepost', (req, res)=> {
	Posts.find({ POST_ID: req.body.post_id }).remove()
	.then( responseDB => {
		if(responseDB.deletedCount === 0){
			res.json({
				msg: "Nothing to remove",
			})
		}
		if(responseDB.deletedCount === 1){
			res.json({
				msg: "Successfully removed",
			})
		}
	})
	.catch( err => {
		res.json({
			err
		})
	})

})

module.exports = router;