const jwt = require('jsonwebtoken');

module.exports.session = (request, response, next) => {
  const token = request.get('Authorization');
  if (token) {
    jwt.verify(token, process.env.SECRET, (error, decode) => {
      if (error) {
        response.status(401).json({
          status: 401,
          err: 'Authentication failed (unable to authenticate access token)',
        });
      } else {
        console.log(decode);
        request.decode = decode;
        if(request.decode.expiry < new Date().getTime()){
          response.status(401).json({
            status: 401,
            err: 'Session expired',
          });
        } else {
          next();
        }
      }
    });
  } else {
    response.status(401).json({
      status: 401,
      err: 'Unauthorised access',
    });
  }
};