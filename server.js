const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// env config
require('dotenv').config();
const app = express();

// requiring local modules
const status = require('./Routes/status');
const auth = require('./Routes/auth');
const posts = require('./Routes/posts');

//db connect
require('./Database/connection.js');

// presets
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// port declaration
const port = process.env.PORT || 3000;

// open routes
app.use('/', status);
app.use('/auth', auth);

//secure routes
app.use('/posts', posts);
// Init the server
app.listen( port, () => {})