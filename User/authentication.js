const router = require("express").Router();
const User = require("./users");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // checking it user has already registerd
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.send("Email already exist");

  // Hashing the password for security reasons
  const salt = await bcrypt.genSalt(10);
  const hashedpwd = await bcrypt.hash(req.body.password, salt);

  // Registering the user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedpwd,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist) return res.status(400).send("User doesn't Exist");

  const validpwd = await bcrypt.compare(req.body.password, userExist.password);
  if (!validpwd) return res.status(400).send("Invalid Password");

  const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
