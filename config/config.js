require("dotenv").config();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;
const JWTSECRET = process.env.JWTSECRET;
const BASE_URL = process.env.BASE_URL;
const APP_EMAIL = process.env.APP_EMAIL;
const APP_EMAIL_PASS = process.env.APP_EMAIL_PASS;

module.exports = {
  MONGODB_URI,
  PORT,
  JWTSECRET,
  BASE_URL,
  APP_EMAIL,
  APP_EMAIL_PASS,
};
