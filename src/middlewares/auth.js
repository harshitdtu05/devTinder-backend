const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) throw new Error("No token found in cookies");

    // Validate the token
    const decodedToken = await jwt.verify(token, "DEV@Tinder");
    const { _id } = decodedToken;

    // Find the user
    const user = await User.findById(_id);
    if (!user) throw new Error("User does not exist");

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { userAuth };
