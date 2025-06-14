const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.REACT_APP_SECRET_KEY;
const expiration = "5h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ email, firstName, lastName, id, isAdmin }) {
    const payload = { email, firstName, lastName, id, isAdmin };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
