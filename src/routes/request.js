const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/interested/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      res.send("Connection request sent successfully from user: " + user.email);
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  }
);

module.exports = connectionRequestRouter;
