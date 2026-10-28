// Membaca ringkasan dari JSON menjadi verdict.
// Selisih positif berarti Indonesia tertinggal (kecuali arah netral), jadi
// perubahan selisih negatif berarti selisih menyempit, untuk indikator
// tinggi_bagus maupun rendah_bagus.

import { fmt } from "./format";
import type { Konfig } from "./konfigurasi";
import type { Ringkasan } from "./data";

export type KodeVerdict =
  | "unggul"
  | "menyalip"
  | "mengejar"
  | "stagnan"
  | "melebar"
  | "netral";

export interface Verdict {
  kode: KodeVerdict;
  awal: number | null;
  akhir: number | null;
  delta: number | null;
}

export function verdict(r: Ringkasan, ambang = 0.5): Verdict {
  const awal = r.gap_vs_asean_awal;
  const akhir = r.gap_vs_asean_akhir;
  const delta = r.perubahan_gap_vs_asean;
  if (r.arah === "netral" || awal == null || akhir == null || delta == null) {
    return { kode: "netral", awal, akhir, delta };
  }

  let kode: KodeVerdict;
  if (awal <= 0 && akhir <= 0) kode = "unggul";
  else if (awal > 0 && akhir <= 0) kode = "menyalip";
  else if (Math.abs(delta) < ambang) kode = "stagnan";
  else kode = delta < 0 ? "mengejar" : "melebar";
  return { kode, awal, akhir, delta };
}

export function kalimat(v: Verdict, k: Konfig): string {
  if (v.awal == null || v.akhir == null) {
    return `Selisih ${k.judulPendek.toLowerCase()} dengan rata-rata ASEAN tidak dapat dihitung.`;
  }
  const a = fmt(Math.abs(v.awal), k.desimal);
  const b = fmt(Math.abs(v.akhir), k.desimal);
  const u = k.satuanSelisih;
  const hal = k.judulPendek.toLowerCase();
  switch (v.kode) {
    case "mengejar":
      return `Selisih ${hal} dengan rata-rata ASEAN menyempit dari ${a} menjadi ${b} ${u}.`;
    case "melebar":
      return `Selisih ${hal} dengan rata-rata ASEAN melebar dari ${a} menjadi ${b} ${u}.`;
    case "stagnan":
      return `Selisih ${hal} dengan rata-rata ASEAN nyaris tak berubah: ${a} menjadi ${b} ${u}.`;
    case "unggul":
      return `Indonesia lebih baik ${b} ${u} dari rata-rata ASEAN dalam ${hal}.`;
    case "menyalip":
      return `Indonesia kini lebih baik ${b} ${u} dari rata-rata ASEAN, setelah tertinggal ${a} ${u} di awal.`;
    default:
      return `Selisih ${hal} dengan rata-rata ASEAN: ${b} ${u}.`;
  }
}
