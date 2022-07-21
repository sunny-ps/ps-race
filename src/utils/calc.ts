/**
 * Given a max and min value, normalize the given value between 0 and 100
 * zi = (xi – min(x)) / (max(x) – min(x)) * 100
 * @param x Number to normalize
 * @param minVal Minimum value in the dataset
 * @param maxVal Minimum value in the dataset
 * @returns The normalized value
 */
export function normalizeValue(x: number, minVal: number, maxVal: number) {
  return ((x - minVal) / (maxVal - minVal)) * 100;
}

/**
 * Given a max and min value, denormalize the given value
 * zi = (xi / 100) / (max(x) – min(x)) + min(x)
 * @param x Number to normalize
 * @param minVal Minimum value in the dataset
 * @param maxVal Minimum value in the dataset
 * @returns The normalized value
 */
export function denormalizeValue(x: number, minVal: number, maxVal: number) {
  return (x / 100) * (maxVal - minVal) + minVal;
}

// y = (x / total) * 100
export function findPercentage(x: number, total: number) {
  return (x / total) * 100;
}
