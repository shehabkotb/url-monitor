const toSecondsMinutesCron = require("../utils/toSecondsMinutesCron");

describe("total seconds to repeat cron string every x seconds or minutes", () => {
  test("return cron string that repeats with seconds if totalseconds is less than a minute", () => {
    const testSeconds = 10;

    const result = toSecondsMinutesCron(testSeconds);

    expect(result).toMatch(`*/${testSeconds} * * * * *`);
  });

  test("return cron string that repeats with minutes if totalseconds is more than a minute", () => {
    const testSeconds = 110;

    const result = toSecondsMinutesCron(testSeconds);

    expect(result).toMatch(`* */${Math.floor(testSeconds / 60)} * * * *`);
  });
});
