const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  pushoverEmail: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
});

userSchema.methods.generateAuthToken = function () {
  const jwtToken = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    config.JWTSECRET
  );

  return jwtToken;
};

userSchema.methods.generateEmailToken = function () {
  const jwtToken = jwt.sign(
    {
      id: this._id,
    },
    config.JWTSECRET,
    { expiresIn: "10m" }
  );

  return jwtToken;
};

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user, requestType) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
    pushoverEmail: Joi.string().min(5).max(255).email().optional(),
    // we validate the password sent from user
    password: Joi.string()
      .min(5)
      .max(255)
      .alter({
        post: (schema) => schema.required(),
        put: (schema) => schema.optional(),
      }),
  });

  return schema.tailor(requestType).validate(user);
}

exports.User = User;
exports.validate = validateUser;
