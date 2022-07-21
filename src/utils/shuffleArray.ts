/**
 * Shuffle an array in-place using Durstenfeld shuffle algorithm
 * @param array Array to randomize
 * @return
 */
export function shuffleArray<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Shuffle an array using Schwartzian transform
 * @param array Array to randomize
 * @return shuffled array
 */
export function shuffleArray2<T>(array: Array<T>): Array<T> {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
