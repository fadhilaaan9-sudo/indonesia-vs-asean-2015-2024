// Chart garis SVG murni, tanpa paket chart tambahan.
// Indonesia merah 3px, Singapura dan Malaysia abu-abu 1px, rata-rata ASEAN
// putus-putus warna tinta. Nilai null memutus garis, tidak diisi.

import { useState } from "react";
import { fmt } from "../../lib/format";
import type { SeriesRow } from "../../lib/data";
import { ChartTooltip } from "./ChartTooltip";
import type { BarisTooltip } from "./ChartTooltip";

const W = 640;
const H = 300;
const L = 56;
const R = 100;
const T = 16;
const B = 30;

interface GarisVsAseanProps {
  data: SeriesRow[];
  tampilIdn?: boolean;
  tampilMedian?: boolean;
  satuan: string;
  desimal: number;
  label: string;
}

type Kunci = "IDN" | "SGP" | "MYS" | "rata_asean";

function segmen(
  nilai: Array<number | null>,
  x: (i: number) => number,
  y: (v: number) => number,
): string[] {
  const hasil: string[] = [];
  let d = "";
  nilai.forEach((v, i) => {
    if (v == null) {
      if (d) hasil.push(d);
      d = "";
      return;
    }
    d += `${d ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
  });
  if (d) hasil.push(d);
  return hasil;
}

export function GarisVsAsean({
  data,
  tampilIdn = true,
  tampilMedian = true,
  satuan,
  desimal,
  label,
}: GarisVsAseanProps) {
  const [hover, setHover] = useState<number | null>(null);

  const kunci: Kunci[] = ["IDN", "SGP", "MYS", "rata_asean"];
  const semua = data.flatMap((s) =>
    kunci.map((k) => s[k]).filter((v): v is number => v != null),
  );
  if (data.length === 0 || semua.length === 0) return null;

  const n = data.length;
  const min0 = Math.min(...semua);
  const max0 = Math.max(...semua);
  const pad = (max0 - min0 || 1) * 0.08;
  const min = min0 - pad;
  const max = max0 + pad;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const x = (i: number) => L + (i / (n - 1)) * plotW;
  const y = (v: number) => T + (1 - (v - min) / (max - min)) * plotH;

  const ticks = [0, 1, 2, 3].map((k) => min + (k / 3) * (max - min));
  const tahunLabel = data.map((s, i) => ({ i, tahun: s.year })).filter((t) =>
    [0, 3, 6, 9].includes(t.i),
  );

  const seriAbu = (
    [
      { kunci: "SGP", nama: "Singapura" },
      { kunci: "MYS", nama: "Malaysia" },
    ] as const
  ).filter((s) => data.some((d) => d[s.kunci] != null));

  // Nilai terakhir yang ada untuk satu kunci, dicari dengan loop biasa
  // supaya tipenya jelas (nilai bisa null kalau tidak ada data sama sekali).
  function nilaiTerakhirAda(
    baris: SeriesRow[],
    kunci: Kunci,
  ): { idx: number; nilai: number | null } {
    let idx = -1;
    let nilai: number | null = null;
    for (let i = 0; i < baris.length; i++) {
      const v = baris[i][kunci];
      if (v != null) {
        idx = i;
        nilai = v;
      }
    }
    return { idx, nilai };
  }

  // Label di ujung garis, digeser supaya tidak bertumpuk.
  const labelJadi = (
    [
      ...seriAbu.map((s) => ({
        nama: s.nama,
        kunci: s.kunci as Kunci,
        warna: "var(--color-tinta-lembut)",
        tebal: false,
        tampil: true,
      })),
      {
        nama: "Rata-rata ASEAN",
        kunci: "rata_asean" as Kunci,
        warna: "var(--color-tinta)",
        tebal: false,
        tampil: tampilMedian,
      },
      {
        nama: "Indonesia",
        kunci: "IDN" as Kunci,
        warna: "var(--color-idn)",
        tebal: true,
        tampil: tampilIdn,
      },
    ] as const
  )
    .flatMap((s) => {
      const t = nilaiTerakhirAda(data, s.kunci);
      if (t.idx < 0 || t.nilai == null) return [];
      return [
        {
          ...s,
          idxTerakhir: t.idx,
          nilaiTerakhir: t.nilai,
          yAwal: y(t.nilai),
        },
      ];
    })
    .sort((a, b) => a.yAwal - b.yAwal);
  let ySebelumnya = -Infinity;
  const labelDenganPosisi = labelJadi.map((s) => {
    const yLabel = Math.max(s.yAwal, ySebelumnya + 16);
    ySebelumnya = yLabel;
    return { ...s, yLabel };
  });

  const saatGerak = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((px - L) / plotW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  };

  // Titik yang berdiri sendiri (tetangga kiri-kanan kosong) digambar
  // sebagai dot, karena segmen garis yang hanya satu titik tidak terlihat.
  const titikTerisolasi = (kunci: Kunci) =>
    data
      .map((d, i) => ({ i, v: d[kunci] }))
      .filter(
        ({ i, v }) =>
          v != null &&
          (i === 0 || data[i - 1][kunci] == null) &&
          (i === n - 1 || data[i + 1][kunci] == null),
      );

  const barisHover: BarisTooltip[] =
    hover == null
      ? []
      : [
          {
            nama: "Indonesia",
            warna: "var(--color-idn)",
            nilai: data[hover].IDN,
            desimal,
          },
          {
            nama: "Singapura",
            warna: "var(--color-negara-lain)",
            nilai: data[hover].SGP,
            desimal,
          },
          {
            nama: "Malaysia",
            warna: "var(--color-negara-lain)",
            nilai: data[hover].MYS,
            desimal,
          },
          {
            nama: "Rata-rata ASEAN",
            warna: "var(--color-tinta)",
            nilai: data[hover].rata_asean,
            desimal,
          },
        ];

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label={label}
        onMouseMove={saatGerak}
        onMouseLeave={() => setHover(null)}
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

        <g opacity="1">
          {seriAbu.map((s) =>
            segmen(
              data.map((d) => d[s.kunci]),
              x,
              y,
            ).map((d, i) => (
              <path
                key={`${s.kunci}-${i}`}
                d={d}
                fill="none"
                stroke="var(--color-negara-lain)"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
            )),
          )}
          {seriAbu.map((s) =>
            titikTerisolasi(s.kunci).map(({ i, v }) => (
              <circle
                key={`dot-${s.kunci}-${i}`}
                cx={x(i)}
                cy={y(v!)}
                r="2.5"
                fill="var(--color-negara-lain)"
                stroke="var(--color-permukaan)"
                strokeWidth="1.5"
              />
            )),
          )}
        </g>

        <g
          opacity={tampilMedian ? 1 : 0}
          style={{ transition: "opacity 300ms ease" }}
        >
          {segmen(
            data.map((d) => d.rata_asean),
            x,
            y,
          ).map((d, i) => (
            <path
              key={`mean-${i}`}
              d={d}
              fill="none"
              stroke="var(--color-tinta)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
          ))}
          {titikTerisolasi("rata_asean").map(({ i, v }) => (
            <circle
              key={`dot-mean-${i}`}
              cx={x(i)}
              cy={y(v!)}
              r="3"
              fill="var(--color-tinta)"
              stroke="var(--color-permukaan)"
              strokeWidth="1.5"
            />
          ))}
        </g>

        <g
          opacity={tampilIdn ? 1 : 0}
          style={{ transition: "opacity 300ms ease" }}
        >
          {segmen(
            data.map((d) => d.IDN),
            x,
            y,
          ).map((d, i) => (
            <path
              key={`idn-${i}`}
              d={d}
              fill="none"
              stroke="var(--color-idn)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {titikTerisolasi("IDN").map(({ i, v }) => (
            <circle
              key={`dot-idn-${i}`}
              cx={x(i)}
              cy={y(v!)}
              r="3"
              fill="var(--color-idn)"
              stroke="var(--color-permukaan)"
              strokeWidth="1.5"
            />
          ))}
        </g>

        {labelDenganPosisi.map((s) =>
          s.tampil ? (
            <text
              key={s.nama}
              x={x(s.idxTerakhir) + 8}
              y={s.yLabel}
              dominantBaseline="middle"
              fontSize="12"
              fontWeight={s.tebal ? "600" : "400"}
              fill={s.warna}
            >
              {s.nama}
            </text>
          ) : null,
        )}

        {hover != null && (
          <g>
            <line
              x1={x(hover)}
              y1={T}
              x2={x(hover)}
              y2={T + plotH}
              stroke="var(--color-tinta)"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            {(
              [
                ["IDN", "var(--color-idn)", 4],
                ["SGP", "var(--color-negara-lain)", 3],
                ["MYS", "var(--color-negara-lain)", 3],
                ["rata_asean", "var(--color-tinta)", 3.5],
              ] as const
            ).map(([k, warna, r]) => {
              const v = data[hover][k];
              if (v == null) return null;
              return (
                <circle
                  key={k}
                  cx={x(hover)}
                  cy={y(v)}
                  r={r}
                  fill={warna}
                  stroke="var(--color-permukaan)"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        )}
      </svg>
      {hover != null && (
        <div
          className="pointer-events-none absolute top-2 z-10"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            transform:
              hover === 0
                ? "translateX(0)"
                : hover === n - 1
                  ? "translateX(-100%)"
                  : "translateX(-50%)",
          }}
        >
          <ChartTooltip
            tahun={data[hover].year}
            baris={barisHover}
            satuan={satuan}
          />
        </div>
      )}
    </div>
  );
}
