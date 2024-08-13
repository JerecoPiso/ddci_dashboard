export interface Clients {
  name: string;
}
export interface Counts {
  billed: number;
  rejects: number;
  receives: number;
  accuracy: number;
  error: number;
  uploaded: 0;
  ocred: 0;
}
export interface HourlyArrival {
  time: string;
  count: number;
}
export const countComparer = (current: number, previous: number) => {
    let _diff: string = "";
    if (current > previous) {
      _diff =
        "+ " +
        ((current - previous) / 100).toFixed(2).toString() +
        "% from the previous day";
    } else if (current < previous) {
      _diff =
        "- " +
        ((previous - current) / 100).toFixed(2).toString() +
        "% from the previous day";
    } else if (current == previous) {
      _diff = "there's no changes in count";
    }
    return _diff;
  };
export const ranges = ["_025", "_2650", "_51_75", "_76100"];
export const colors = [
    "var(--color-_025)",
    "var(--color-_2650)",
    "var(--color-_51_75)",
    "var(--color-_76100)",
  ];
