const axios = require('axios');
// const REDIRECT_URI = 'https://allaboutcovid-19.herokuapp.com/auth/google'
const REDIRECT_URI = 'http://localhost:3000/auth/google';

// function to get access_token from credentials of the client
async function getAccessTokenFromCode(code) {
	const { data } = await axios({
		url: `https://oauth2.googleapis.com/token`,
		method: 'POST',
		data: {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			redirect_uri: REDIRECT_URI,
			grant_type: 'authorization_code',
			code,
		},
	})
	return data.access_token;
};


// funciton to get the user data
async function getUserData(accesstoken) {
	const { data } = await axios({
		url: 'https://www.googleapis.com/oauth2/v2/userinfo',
		method: 'get',
		headers: {
			Authorization: `Bearer ${accesstoken}`,
		},
	})
	return data;
};


module.exports.getAccessTokenFromCode = getAccessTokenFromCode;
module.exports.getUserData = getUserData;