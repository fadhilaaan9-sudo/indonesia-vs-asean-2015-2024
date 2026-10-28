// Tooltip kaca untuk chart SVG. Hanya dipakai di header dan tooltip,
// tidak pernah di atas area chart yang besar.

import { fmt } from "../../lib/format";

export interface BarisTooltip {
  nama: string;
  warna: string;
  nilai: number | null;
  desimal: number;
}

interface ChartTooltipProps {
  tahun: number | null;
  baris: BarisTooltip[];
  satuan: string;
}

export function ChartTooltip({ tahun, baris, satuan }: ChartTooltipProps) {
  if (tahun == null) return null;
  return (
    <div className="kaca rounded-chip border border-white/60 px-3 py-2 text-sm text-tinta">
      <p className="font-medium">{tahun}</p>
      <ul className="mt-1 space-y-0.5">
        {baris.map((b) => (
          <li
            key={b.nama}
            className="flex items-center gap-2 whitespace-nowrap text-tinta-lembut"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: b.warna }}
              aria-hidden="true"
            />
            <span>{b.nama}</span>
            <span className="ml-auto pl-4 tabular-nums text-tinta">
              {b.nilai == null
                ? "tidak ada data"
                : `${fmt(b.nilai, b.desimal)}${satuan}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
