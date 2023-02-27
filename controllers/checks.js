const router = require("express").Router();
const { Check, validate } = require("../models/check");
const auth = require("../middleware/auth");
const access = require("../middleware/access");
const poller = require("../jobs/poll");

// get by tags
router.get("/", [auth], async (req, res) => {
  const tagList = req.query.tag;
  if (!tagList) return res.status(400).json({ error: "Invalid link" });

  const result = await Check.find({
    createdBy: req.user._id,
    tags: { $in: tagList },
  });

  return res.status(200).json(result);
});

router.get("/:id", [auth, access], async (req, res) => {
  return res.status(200).json(req.check);
});

router.get("/:id/stop", [auth, access], async (req, res) => {
  poller.stop(toString(req.check._id));
  return res.status(200).json({ message: "successfully stoped monitoring" });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body, "post");

  if (error) return res.status(400).json({ error: error.details[0].message });

  const check = new Check({ ...req.body, createdBy: req.user._id });
  const savedCheck = await check.save();

  poller.start(toString(savedCheck._id), savedCheck, savedCheck.interval);

  return res.status(201).json(savedCheck);
});

router.put("/:id", [auth, access], async (req, res) => {
  const { error } = validate(req.body, "put");
  if (error) return res.status(400).json({ error: error.details[0].message });

  poller.stop(toString(req.check._id));
  const savedCheck = await Check.findByIdAndUpdate(req.check._id, req.body, {
    new: true,
    omitUndefined: true,
  });

  poller.start(toString(savedCheck._id), savedCheck, savedCheck.interval);

  return res.status(200).json(savedCheck);
});

router.delete("/:id", [auth, access], async (req, res) => {
  poller.stop(toString(req.check._id));
  await Check.deleteOne({ _id: req.check._id });
  return res.status(204).end();
});

module.exports = router;
