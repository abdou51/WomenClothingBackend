const jwt = require("jsonwebtoken");
const secret = process.env.secret;

function generateToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    secret
  );
}

module.exports = generateToken;
