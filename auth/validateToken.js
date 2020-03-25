const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  let token = req.headers["authorization"];

  // Remove Bearer from string
  token = token.slice(7, token.length);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err.message);
        return res.status(403).json({
          error: "Token is not valid"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      error: "Token is not supplied"
    });
  }
};

module.exports = checkToken;
