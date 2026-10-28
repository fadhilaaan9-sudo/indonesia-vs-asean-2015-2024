// Format angka mengikuti penulisan Indonesia: koma desimal, titik ribuan.
export const fmt = (n: number, d = 1): string =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n);
