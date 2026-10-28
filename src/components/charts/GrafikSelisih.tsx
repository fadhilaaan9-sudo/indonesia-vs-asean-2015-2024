// Chart selisih SVG murni. Garis nol berarti sejajar rata-rata ASEAN:
// di atas nol berarti tertinggal, di bawah nol berarti unggul.

import { fmt } from "../../lib/format";
import type { SeriesRow } from "../../lib/data";

const W = 640;
const H = 280;
const L = 56;
const R = 110;
const T = 16;
const B = 30;

interface GrafikSelisihProps {
  data: SeriesRow[];
  satuanSelisih: string;
  desimal: number;
  label: string;
}

export function GrafikSelisih({
  data,
  satuanSelisih,
  desimal,
  label,
}: GrafikSelisihProps) {
  const nilai = data.map((s) => s.gap_vs_asean);
  const ada = nilai.filter((v): v is number => v != null);
  if (data.length === 0 || ada.length === 0) return null;

  const n = data.length;
  const min0 = Math.min(0, ...ada);
  const max0 = Math.max(0, ...ada);
  const pad = (max0 - min0 || 1) * 0.08;
  const min = min0 - pad;
  const max = max0 + pad;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const x = (i: number) => L + (i / (n - 1)) * plotW;
  const y = (v: number) => T + (1 - (v - min) / (max - min)) * plotH;

  const ticks = [0, 1, 2, 3].map((k) => min + (k / 3) * (max - min));
  const tahunLabel = data
    .map((s, i) => ({ i, tahun: s.year }))
    .filter((t) => [0, 3, 6, 9].includes(t.i));

  let d = "";
  const potongan: string[] = [];
  nilai.forEach((v, i) => {
    if (v == null) {
      if (d) potongan.push(d);
      d = "";
      return;
    }
    d += `${d ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
  });
  if (d) potongan.push(d);

  const terakhir = ada[ada.length - 1];
  const idxTerakhir = nilai.lastIndexOf(terakhir);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={label}
    >
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={L}
            y1={y(t)}
            x2={W - R}
            y2={y(t)}
            stroke="var(--color-garis)"
            strokeWidth="1"
          />
          <text
            x={L - 8}
            y={y(t)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="12"
            fill="var(--color-tinta-lembut)"
          >
            {fmt(t, desimal)}
          </text>
        </g>
      ))}
      {tahunLabel.map((t) => (
        <text
          key={t.i}
          x={x(t.i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="12"
          fill="var(--color-tinta-lembut)"
        >
          {t.tahun}
        </text>
      ))}

      <line
        x1={L}
        y1={y(0)}
        x2={W - R}
        y2={y(0)}
        stroke="var(--color-tinta)"
        strokeWidth="1.25"
        strokeDasharray="5 4"
      />
      {max > 0 && (
        <text
          x={L + 6}
          y={T + 12}
          fontSize="12"
          fill="var(--color-tinta-lembut)"
        >
          Tertinggal
        </text>
      )}
      {min < 0 && (
        <text
          x={L + 6}
          y={T + plotH - 4}
          fontSize="12"
          fill="var(--color-tinta-lembut)"
        >
          Unggul
        </text>
      )}

      {potongan.map((seg, i) => (
        <path
          key={i}
          d={seg}
          fill="none"
          stroke="var(--color-idn)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {nilai.map((v, i) =>
        v == null ? null : (
          <circle
            key={i}
            cx={x(i)}
            cy={y(v)}
            r="3"
            fill="var(--color-idn)"
            stroke="var(--color-permukaan)"
            strokeWidth="1.5"
          />
        ),
      )}
      <text
        x={x(idxTerakhir) + 8}
        y={y(terakhir)}
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="600"
        fill="var(--color-idn)"
      >
        {fmt(terakhir, desimal)} {satuanSelisih}
      </text>
    </svg>
  );
}
