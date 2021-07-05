function calcRelation(x: number, y: number): number {
  return (y * 100) / x;
}

export function fitInRect(
  { width, height }: { width: number; height: number },
  { width: maxWidth, height: maxHeight }: { width: number; height: number }
): { width: number; height: number } {
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(
      calcRelation(width, maxWidth),
      calcRelation(height, maxHeight)
    );

    return {
      width: (width * ratio) / 100,
      height: (height * ratio) / 100,
    };
  }

  return { width, height };
}
