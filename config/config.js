require("dotenv").config();

const PORT = process.env.PORT || 8080;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://database_owner:password123@127.0.0.1:27017/url_monitor_database";
const JWTSECRET =
  process.env.JWTSECRET ||
  "TASwLncfgL2b2PbLxv72CQz9M8CiRSiOfepHk0LlbSsUn2olrMrk4B9juYEwTpi";
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8080/api";

// you should make a gmail and create an app password for email to work
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
