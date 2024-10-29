/*
  Calculates the next polling interval based on the current interval and maximum interval
*/
export const calculateBackoff = (
  interval: number,
  maxInterval: number
): number => {
  return Math.min(interval * 2, maxInterval);
};
