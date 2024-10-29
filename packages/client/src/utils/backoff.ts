export const calculateBackoff = (
  interval: number,
  maxInterval: number
): number => {
  return Math.min(interval * 2, maxInterval);
};
