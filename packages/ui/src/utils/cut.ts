export function cut(start: number, end: number, value: number) {
  if (value < start) return start;
  if (value > end) return end;

  return value;
}
