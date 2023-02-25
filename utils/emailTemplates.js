const config = require("../config/config");

const verify = (name, token) => {
  return `<h3>Hello ${name}, Please Verify your email address</h3>
    <p>Click <a href="${config.BASE_URL}/users/verify/${token}">here</a> to verify your email address, the link is valid for only 10 minutes.</p>`;
};

// another template for reports

module.exports = {
  verify,
};
