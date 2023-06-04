export function addBigInt(A: string, B: string) {
  const one: string = String(A);
  const two: string = String(B);
  const AL: number = one.length;
  const BL: number = two.length;
  const ML: number = Math.max(AL, BL);

  let carry: number = 0,
    sum: string = '';

  for (let i: number = 1; i <= ML; i++) {
    const a: any = +one.charAt(AL - i);
    const b: any = +two.charAt(BL - i);

    let t: any = carry + a + b;
    carry = (t / 10) | 0;
    t %= 10;

    sum = i === ML && carry ? carry * 10 + t + sum : t + sum;
  }

  return sum;
}
