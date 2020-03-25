const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { validationRules, validate } = require("../auth/validateRequest");

//Models
const User = require("../models/User");

router.post("/signup", validationRules(), validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });

    // Do not save if user exists
    if (user) {
      res.status(400).json({ error: "Email already exists" });
    }

    user = await User.create({ email, password, dashboardIds: [] });

    //Save user
    const payload = {
      id: user.id
    };

    //Create JWT with user ID
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 36000000 }, (err, token) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ token });
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).end();
  }
});

router.post("/signin", validationRules(), validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });

    //Do not login if user doesn't exist
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Check if password is correct
    const validate = await user.isValidPassword(password);

    if (!validate) {
      return res.status(400).json({ error: "Password is incorrect" });
    }
    const payload = {
      id: user.id
    };
    //Create JWT with user ID
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 36000000 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token, dashboardIds: user.dashboardIds });
    });
  } catch (err) {
    console.log(err.message);
    res.status(404).end();
  }
});

module.exports = router;
