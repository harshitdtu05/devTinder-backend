const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { connection } = require("mongoose");
const User = require("../models/user");

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS = ["interested", "ignored"];

      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Invalid status" + status });
      }

      //   Check if the user exists in database
      const userExists = await User.findById(toUserId);
      if (!userExists) {
        return res
          .status(404)
          .json({ message: "User not found with id: " + toUserId });
      }

      //   Check if there is an existing connection request between the two users
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already exists between these users",
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection marked as " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  }
);

module.exports = connectionRequestRouter;
