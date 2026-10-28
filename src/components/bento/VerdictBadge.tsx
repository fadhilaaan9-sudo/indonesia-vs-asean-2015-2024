// Ikon digambar sendiri sebagai SVG inline, supaya tidak perlu paket ikon
// tambahan. Verdict selalu ikon + teks + warna, tidak bergantung warna saja.

import type { ComponentType } from "react";
import type { KodeVerdict } from "../../lib/verdict";

type IkonProps = { className?: string };

function IkonCeklis({ className }: IkonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5.5" />
    </svg>
  );
}

function IkonNaik({ className }: IkonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function IkonTurun({ className }: IkonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </svg>
  );
}

function IkonGaris({ className }: IkonProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

const GAYA: Record<
  KodeVerdict,
  { label: string; Ikon: ComponentType<IkonProps>; kelas: string }
> = {
  unggul: {
    label: "Sudah unggul",
    Ikon: IkonCeklis,
    kelas: "bg-unggul/10 text-unggul",
  },
  menyalip: {
    label: "Menyalip",
    Ikon: IkonCeklis,
    kelas: "bg-unggul/10 text-unggul",
  },
  mengejar: {
    label: "Mengejar",
    Ikon: IkonNaik,
    kelas: "bg-mengejar/10 text-mengejar",
  },
  stagnan: {
    label: "Jalan di tempat",
    Ikon: IkonGaris,
    kelas: "bg-stagnan/10 text-stagnan",
  },
  melebar: {
    label: "Tertinggal",
    Ikon: IkonTurun,
    kelas: "bg-tertinggal/10 text-tertinggal",
  },
  netral: {
    label: "Tidak dinilai",
    Ikon: IkonGaris,
    kelas: "bg-stagnan/10 text-stagnan",
  },
};

export function VerdictBadge({ kode }: { kode: KodeVerdict }) {
  const { label, Ikon, kelas } = GAYA[kode];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 text-sm font-medium ${kelas}`}
    >
      <Ikon className="size-4" />
      {label}
    </span>
  );
}
