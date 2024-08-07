export type BOL = {
  document: string;
  client: string;
  type: string;
  production: string;
  status: string;
  createdat: string;
  accuracy: string
};
export type AccuracyData = {
  index: number;
  accuracy_range: string;
  accuracy_count: number;
  fill: string;
};

// const generateRandomNumber = () => {
//   const number = Math.floor(Math.random() * 100) + 1; // Generates a number between 1 and 100
//   return number;
// };

export const generateAccuracyData = (
    ranges: string[],
    colors: string[]
  ): AccuracyData[] => {
    return ranges.map((range, index) => ({
      index,
      accuracy_range: range,
      accuracy_count: 0,
      fill: colors[index] || "var(--default-color)",
    }));
  };