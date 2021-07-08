const SEED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function random(length: number): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += SEED.charAt(Math.floor(Math.random() * SEED.length));
  }

  return result;
}
