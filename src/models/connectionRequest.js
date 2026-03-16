const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} is not a valid status for connection request`,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  if (
    this.fromUserId &&
    this.toUserId &&
    this.fromUserId.equals(this.toUserId)
  ) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
