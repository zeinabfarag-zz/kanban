const express = require("express");
const router = express.Router();
const upload = require("../util/file-upload");

router.post("/url", upload.single("file"), async (req, res) => {
  try {
    res
      .status(200)
      .json({ url: req.file.location, name: req.file.originalname });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
