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
  webhook: { type: String, minlength: 5, maxlength: 1024 },
  timeout: { type: Number, min: 0, max: 60, default: 5 }, // default 5 seconds
  interval: { type: Number, min: 0, max: 3600, default: 600 }, // default 10 minutes
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

checkSchema.methods.updateStatus = async function (
  currentStatus,
  resposneTime,
  callbackFunction
) {
  let statusChanged = false;
  if (this.report.status !== currentStatus) statusChanged = true;

  this.report.status = currentStatus;
  if (currentStatus === "up") {
    this.report.uptime += this.interval;
    this.report.history.push({
      responseTime: resposneTime,
      status: "up",
    });
  } else if (currentStatus === "down") {
    this.report.downtime += this.interval;
    this.report.outages += 1;
    this.report.history.push({
      responseTime: 0,
      status: "down",
    });
  }

  let savedCheck = await this.save();
  savedCheck = await savedCheck.populate("createdBy");

  if (statusChanged) {
    await callbackFunction(savedCheck);
  }
};

checkSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Check = mongoose.model("Check", checkSchema);

function validateCheck(check, requestType) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
    url: Joi.string()
      .min(5)
      .max(1024)
      .uri()
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
    protocol: Joi.string()
      .valid("HTTP", "HTTPS", "TCP")
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
    port: Joi.number().min(0).max(65536).optional(),
    webhook: Joi.string().min(5).max(1024).optional().uri(),
    timeout: Joi.number().min(0).max(60).optional(),
    interval: Joi.number().min(0).max(3600).optional(),
    tags: Joi.array().unique().items(Joi.string().min(1).max(50)),
    ignoreSSL: Joi.boolean().optional(),
    authentication: Joi.object({
      username: Joi.string().min(3).max(50).required(),
      password: Joi.string().min(5).max(255).required(),
    }).optional(),
  });

  return schema.tailor(requestType).validate(check);
}

exports.Check = Check;
exports.validate = validateCheck;
