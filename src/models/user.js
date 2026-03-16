const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female"],
        message: `{VALUE} is not a valid gender`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL for photo: " + value);
        }
      },
    },
    about: {
      type: String,
      default:
        "This is a default about section. Please update it to tell others about yourself.",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1 }, { lastName: 1 });

userSchema.methods.getJWT = async function () {
  const User = this;
  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder", {
    expiresIn: "1h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
