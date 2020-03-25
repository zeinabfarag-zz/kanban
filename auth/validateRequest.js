const { body, validationResult } = require("express-validator");

const validationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email is not valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters or longer")
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  //Extract only messages from errors
  const errorMessages = [];
  errors.array().map(err => errorMessages.push(err.msg));

  return res.status(422).json({
    errors: errorMessages
  });
};

module.exports = {
  validationRules,
  validate
};
