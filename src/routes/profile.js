const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user profile:" + err.message);
  }
});

// Update a user
profileRouter.patch("/profile/edit/:userId", userAuth, async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // Validation check for API request body to allow only certain fields to be updated
    const ALLOWED_FIELDS = ["about", "skills", "photoUrl"];

    const isUpdateValid = Object.keys(data).every((field) =>
      ALLOWED_FIELDS.includes(field)
    );

    if (!isUpdateValid) {
      throw new error("Invalid update fields");
    }

    if (data?.skills.length > 5) {
      throw new error("You can add up to 5 skills only");
    }

    console.log(data);

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error finding user" + err.message);
  }
});

module.exports = profileRouter;
