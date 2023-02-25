const router = require("express").Router();
const { Check, validate } = require("../models/check");
const auth = require("../middleware/auth");
const access = require("../middleware/access");

router.get("/:id", [auth, access], async (req, res) => {
  return res.status(200).json(req.check);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const check = new Check({ ...test, createdBy: req.user._id });
  const savedCheck = await check.save();

  return res.status(201).json(savedCheck);
});

router.put("/:id", [auth, access], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const result = await Check.findByIdAndUpdate(req.check._id, req.body, {
    new: true,
    omitUndefined: true,
  });

  return res.status(200).json(result);
});

router.delete("/:id", [auth, access], async (req, res) => {
  await Check.deleteOne({ _id: req.check._id });
  return res.status(204).end();
});

module.exports = router;
