const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validate");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignUpData(req);

    const { firstName, lastName, email, password, age, gender } = req.body;

    // Encrypting the password before saving to database
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating an instance of user model and saving it to database
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
    });

    // saving the user to database and sending response to clients
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user with that email exists in database
    const user = await User.findOne({ email: email });

    // if the user doesn't match or comes out undefined
    if (!user) {
      throw new Error("User not found with email: " + email);
    }

    // check if the password for the email matches
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a JWT token
      const token = await user.getJWT();

      // Add the token to cookie nd send response back to the user/client
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login successful");
    } else throw new Error("Invalid password");
  } catch (err) {
    res.status(400).send("Error creating user:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout successful");
  } catch (err) {
    res.status(400).send("Error logging out:" + err.message);
  }
});

module.exports = authRouter;
