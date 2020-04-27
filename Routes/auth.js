const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require('../Database/models').user;
const queryString = require('query-string');
const helpers = require('../Helpers/helpers.js');
const middleware = require('../Helpers/auth-middleware').session;

const REDIRECT_URI = 'https://thecodeclutch.herokuapp.com/auth/google'
// const REDIRECT_URI = 'http://localhost:3000/auth/google';

// to get the google init auth url (init request from frontend)
router.get('/getGoogleAuthUrl', (request, response) => {
	const stringifiedParams = queryString.stringify({
		client_id: process.env.CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile',
		].join(' '),
		response_type: 'code',
		access_type: 'offline',
		prompt: 'consent',
	});
	const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
	response.status(200).json({
		url: googleLoginUrl
	})
})

// gettting the data from google and redirecting to dashboard
router.get('/google', (request, response) => {
	const urlParams = queryString.parse(request.url);
	const token = urlParams["/google?code"];
	const access_token = helpers.getAccessTokenFromCode(token);
	access_token.then(res => {
		const data = helpers.getUserData(res);
		data.then(result => {
			let newUser = new User({
				NAME: result.name,
				EMAIL: result.email,
				UID: result.id,
				IMAGE_URL: result.picture
			})

			newUser.save()
				.then(responseFromDB => {
					const payload = {
						email: result.email,
						expiry: new Date().getTime() + 900000
					};
					const token = jwt.sign(payload, process.env.SECRET);
					let redirectURL = queryString.stringify({
						name: result.name,
						image: result.picture,
						sessionID: token,
						email: result.email,
					});
					response.status(301).redirect(`https://thecodeclutch.netlify.app/dashboard?${redirectURL}`)
				})
				.catch(err => {
					if (err.code === 11000) {
						User.findOneAndUpdate({
									EMAIL: result.email
								},
								{
									IMAGE_URL: result.picture  
								},
								{
									new: true,         
									runValidators: true             
								})
							.then(doc => {
								const payload = {
									email: result.email,
									expiry: new Date().getTime() + 900000
								};
								const token = jwt.sign(payload, process.env.SECRET);
								let redirectURL = queryString.stringify({
									name: result.name,
									image: result.picture,
									sessionID: token,
									email: result.email,
								});
								response.status(301).redirect(`https://thecodeclutch.netlify.app/dashboard?${redirectURL}`)
							})
							.catch(err => {
								response.status(301).redirect("https://thecodeclutch.netlify.app/error");
							})
					}

				})
		})
		.catch( err => {
				response.status(301).redirect("https://thecodeclutch.netlify.app/error");
		})
	})
	.catch( err => {
		console.log(err)
		response.status(500).json({
			err
		})
	})
});

// to get the new token for persistent session
router.get('/getToken', middleware, (request, response) => {
	const payload = {
		email: request.decode.email,
		expiry: new Date().getTime() + 900000
	};
	const token = jwt.sign(payload, process.env.SECRET);
	response.status(200).json({
		token
	})
})


module.exports = router;