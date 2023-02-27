const axios = require("axios");
const schedule = require("node-schedule");
const sendEmail = require("../utils/email");
const emailTemplates = require("../utils/emailTemplates");
const toSecondsMinutesCron = require("../utils/toSecondsMinutesCron");

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers["request-startTime"] = process.hrtime();
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"];
  const end = process.hrtime(start);
  const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
  response.headers["request-duration"] = milliseconds;
  return response;
});

const start = (checkId, check, interval) => {
  const cronString = toSecondsMinutesCron(interval);

  const job = schedule.scheduleJob(
    checkId,
    cronString,
    pollUrl.bind(null, check)
  );
  console.log("job started");
};

const stop = (checkId) => {
  const job = schedule.scheduledJobs[checkId];
  if (!job) {
    console.log("job doesn't exist");
    return;
  }
  job.cancel();
  console.log("job canceled");
};

const pollUrl = async (check) => {
  try {
    const result = await axiosInstance.get(check.url, {
      timeout: check.timeout * 1000,
    });

    // if status changes from "up" to "down" or vice versa the callback gets called
    check.updateStatus(
      "up",
      result.headers["request-duration"],
      notifyCallback
    );

    console.log("service is up");
  } catch (error) {
    check.updateStatus("down", 0, notifyCallback);

    console.log("service is down or couldn't connect");
  }
};

const notifyCallback = async (check) => {
  try {
    await sendEmail(
      check.createdBy.email,
      `${check.name} is ${check.report.status}`,
      emailTemplates.serviceChanged(
        check.createdBy.name,
        check.name,
        check.report.toJSON()
      )
    );

    if (check.webhook) {
      await axiosInstance.post(check.webhook, {
        message: `your ${check.name} is ${check.report.status}`,
        report: check.report.toJSON(),
      });
    }

    if (check.createdBy.pushoverEmail) {
      await sendEmail(
        check.createdBy.pushoverEmail,
        `${check.name} is ${check.report.status}`,
        emailTemplates.serviceChanged(
          check.createdBy.name,
          check.name,
          check.report.toJSON()
        )
      );
    }
  } catch (error) {
    // console.log(error);
    console.log("couldn't notify user");
  }
};

module.exports = { start, stop };
