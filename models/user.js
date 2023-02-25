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

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    // we validate the password sent from user
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;

// will do similar to this https://github.com/mosh-hamedani/vidly-api-node/blob/73aaf61f3aeb9b7462c1058cf86b4f36ea69d83c/models/user.js
