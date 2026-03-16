const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl"];

// get all the pending connnection requests for the logged in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data sent successful",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error reviewing connection request: " + err.message);
  }
});

// Get all the connections/accepted requests
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const acceptedRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = acceptedRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data sent successfully",
      data: data,
    });
  } catch (err) {
    res.send("Error reviewing the request: " + err.message);
  }
});

// Get the feed of all the users
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const excludedUsersConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        {
          toUserId: loggedInUser._id,
        },
      ],
    });

    const excludedUsersIds = excludedUsersConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId._id;
      else return row.fromUserId._id;
    });

    excludedUsersIds.push(loggedInUser._id);

    const userFeed = await User.find({
      _id: { $nin: excludedUsersIds },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: userFeed,
    });
  } catch (err) {
    res.status(400).send("Error recieving the request: " + err.message);
  }
});

module.exports = userRouter;
