const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
const User = require("../models/userModel")

router.get("/me", auth, (req, res) => {
  res.send({
    userId: req.user._id,
    username: req.user.username,
  });
});

router.get("/allusers",auth, async (req, res) => {
  const keyword = req?.query?.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)

//   .find({_id: {$ne:req.user.id}})
  res.send(users)

});

module.exports = router;
