const config = require("../config/config");

const verify = (name, token) => {
  return `<h3>Hello ${name}, Please Verify your email address</h3>
    <p>Click <a href="${config.BASE_URL}/users/verify/${token}">here</a> to verify your email address, the link is valid for only 10 minutes.</p>`;
};

const serviceChanged = (username, checkName, report) => {
  return `<h3>Hello ${username}, your ${checkName} is ${
    report.status
  }, below is a report for service</h3>
  <ul>
    <li>status: ${report.status}</li>
    <li>outages: ${report.outages}</li>
    <li>uptime: ${report.uptime}</li>
    <li>downtime: ${report.downtime}</li>
    <li>availability: ${report.availability}</li>
    <li>avg response time: ${Math.round(report.avgResponseTime)} ms</li>
  </ul>`;
};

module.exports = {
  verify,
  serviceChanged,
};
