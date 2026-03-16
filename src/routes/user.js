const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

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

module.exports = userRouter;
