export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
const all = args.flat();

  const sorted = all.sort((a, b) => a[0].getTime() - b[0].getTime());

  const result: DowntimeLogs = [];

  for (const [start, end] of sorted) {
    const last = result[result.length - 1];

    if (!last || start > last[1]) {
      result.push([start, end]);
    } else {
      last[1] = new Date(Math.max(last[1].getTime(), end.getTime()));
    }
  }

  return result;

}