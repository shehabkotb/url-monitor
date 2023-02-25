const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const reportSchema = require("./report");

const checkSchema = new Schema({
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  url: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  protocol: { type: String, enum: ["HTTP", "HTTPS", "TCP"], required: true },
  port: { type: Number, min: 0, max: 65536, default: 80 },
  webhook: { type: String, minlength: 5, maxlength: 1024 },
  timeout: { type: Number, min: 0, max: 60, default: 5 }, // default 5 seconds
  interval: { type: Number, min: 0, max: 2592000, default: 600 }, // default 10 minutes
  authentication: {
    username: { type: String, minlength: 3, maxlength: 50 },
    password: { type: String, minlength: 3, maxlength: 255 },
  },
  tags: [
    {
      type: String,
      minlength: 1,
      maxlength: 50,
      index: true,
    },
  ],
  ignoreSSL: { type: Boolean, default: true },
  // initializes report default values
  report: { type: reportSchema, default: () => ({}) },
});

checkSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Check = mongoose.model("Check", checkSchema);

function validateCheck(check) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    url: Joi.string().min(5).max(1024).required().uri(),
    protocol: Joi.string().valid("HTTP", "HTTPS", "TCP").required(),
    port: Joi.number().min(0).max(65536).optional(),
    webhook: Joi.string().min(5).max(1024).optional().uri(),
    timeout: Joi.number().min(0).max(60).optional(),
    interval: Joi.number().min(0).max(2592000).optional(),
    tags: Joi.array().unique().items(Joi.string().min(1).max(50)),
    ignoreSSL: Joi.boolean().optional(),
    authentication: Joi.object({
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(5).max(255).required(),
    }).optional(),
  });

  return schema.validate(check);
}

exports.Check = Check;
exports.validate = validateCheck;
