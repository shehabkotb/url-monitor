const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const sendEmail = require("../utils/email");
const emailTemplates = require("../utils/emailTemplates");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// create/register user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ error: "Email is already registered" });

  const { email, name, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  user = new User({
    email,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  const emailToken = savedUser.generateEmailToken();

  await sendEmail(
    user.email,
    "Email Verfication",
    emailTemplates.verify(user.name, emailToken)
  );

  res.status(201).json({ message: "Verification email sent" });
});

// this route handles email verfications
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  const decoded = jwt.verify(token, config.JWTSECRET);
  if (!decoded.id) return res.status(401).send({ error: "Invalid token" });

  // req.user = await User.findById(decoded.id);
  const result = await User.findByIdAndUpdate(decoded.id, { verified: true });
  if (!result) return res.status(401).send({ error: "Invalid token" });

  res.send("<h1>Successfully Verified your Email<h1>");
});

router.get("/", async (req, res) => {
  const all = await User.find({});
  res.json(all);
});

module.exports = router;
