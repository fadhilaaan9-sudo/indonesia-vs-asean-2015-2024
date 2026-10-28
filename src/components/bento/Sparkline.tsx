// Sparkline SVG murni. Garis Indonesia merah tebal, rata-rata ASEAN
// putus-putus. Nilai null memutus garis, tidak diisi.

interface SparklineProps {
  idn: Array<number | null>;
  asean: Array<number | null>;
  w?: number;
  h?: number;
  label: string;
}

export function Sparkline({ idn, asean, w = 168, h = 48, label }: SparklineProps) {
  const semua = [...idn, ...asean].filter((v): v is number => v != null);
  if (semua.length === 0) return null;
  const min = Math.min(...semua);
  const max = Math.max(...semua);
  const x = (i: number) => (i / (idn.length - 1)) * w;
  const y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const path = (arr: Array<number | null>) =>
    arr.reduce(
      (d, v, i) =>
        v == null
          ? d
          : `${d}${i > 0 && arr[i - 1] != null ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `,
      "",
    );
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-12 w-full max-w-[168px]"
      role="img"
      aria-label={label}
    >
      <path
        d={path(asean)}
        fill="none"
        stroke="var(--color-tinta)"
        strokeWidth="1.25"
        strokeDasharray="4 3"
      />
      <path
        d={path(idn)}
        fill="none"
        stroke="var(--color-idn)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
