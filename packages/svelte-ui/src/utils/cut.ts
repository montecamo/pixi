export function cut(start: number, end: number): (value: number) => number {
  return (value) => {
    if (value < start) return start;
    if (value > end) return end;

    return value;
  };
}
