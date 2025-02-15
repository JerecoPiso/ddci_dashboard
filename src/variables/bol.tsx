export type BOL = {
  document: string;
  client: string;
  type: string;
  production: string;
  status: string;
  createdat: string;
  accuracy: string,
  elapse: string,
  turnaroundtime: string,
  priority: string,
  pages: number
};
export type AccuracyData = {
  index: number;
  accuracy_range: string;
  accuracy_count: number;
  fill: string;
};

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