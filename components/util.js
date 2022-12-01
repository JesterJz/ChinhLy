export const displayTime = (time) => {
  let hours = time.split(":")[0];
  let minutes = time.split(":")[1];
  let seconds = time.split(":")[2];
  let milliseconds = time.split(":")[3];
  let totalTime =
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(seconds) +
    parseInt(milliseconds) / 1000;

  return totalTime;
};
