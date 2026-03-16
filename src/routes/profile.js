const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileUpdateData,
  validatePassword,
} = require("../utils/validate");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user profile:" + err.message);
  }
});

// Update a user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req)) {
      throw new Error("Invalid update fields");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    console.log(loggedInUser);

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}'s profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error updating user profile:" + err.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    validatePassword(req);

    const isOldPasswordValid = await brcypt.compare(
      oldPassword,
      loggedInUser.password
    );

    if (!isOldPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    const newPasswordHash = await bcrypt(newPassword, 10);

    loggedInUser.password = newPasswordHash;

    await loggedInuser.save();

    res.send("Password updated successfully");

    if (!user) {
      throw new Error("User not found with email: " + data.email);
    }
  } catch (err) {
    res.status(400).send("Error updating user password:" + err.message);
  }
});

module.exports = profileRouter;
