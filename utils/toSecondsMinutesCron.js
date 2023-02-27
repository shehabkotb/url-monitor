const toSecondsMinutesCron = (totalSeconds) => {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;

  // if interval is in minutes we ignore the seconds and repeat each minutes
  if (minutes !== 0) return `* */${minutes} * * * *`;
  else return `*/${seconds} * * * * *`;
};

module.exports = toSecondsMinutesCron;
