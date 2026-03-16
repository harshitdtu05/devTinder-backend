const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (firstName.length < 2 || lastName.length < 2) {
    throw new Error(
      "First name and last name must be at least 2 characters long"
    );
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address: " + email);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
    );
  }
};

const validateProfileUpdateData = (req) => {
  const ALLOWED_FIELDS = ["gender", "about", "skills", "photoUrl", "age"];

  const isUpdateValid = Object.keys(req.body).every((field) =>
    ALLOWED_FIELDS.includes(field)
  );

  return isUpdateValid;
};

const validatePassword = (req) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error("Both old password and new password are required");
  } else if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one symbol"
    );
  } else if (newPassword === oldPassword) {
    throw new Error("New password must be different from old password");
  }
};

module.exports = {
  validateSignUpData,
  validateProfileUpdateData,
  validatePassword,
};
