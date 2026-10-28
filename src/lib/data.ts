// Bentuk data persis seperti web_data.json yang dihasilkan notebook analisis.
// Tahun tanpa data bernilai null di series, bukan nol.

import raw from "../../web_data.json";

export type Arah = "tinggi_bagus" | "rendah_bagus" | "netral";

export interface SeriesRow {
  year: number;
  IDN: number | null;
  SGP: number | null;
  MYS: number | null;
  rata_asean: number | null;
  n_negara: number;
  gap_vs_sgp: number | null;
  gap_vs_mys: number | null;
  gap_vs_asean: number | null;
  peringkat_terbaik: number | null;
}

export interface Ringkasan {
  indicator_code: string;
  indicator: string;
  arah: Arah;
  tahun_awal_idn: string;
  tahun_akhir_idn: string;
  nilai_idn_awal: number;
  nilai_idn_akhir: number;
  selisih_idn: number;
  peringkat_terbaik_awal: string | number;
  peringkat_terbaik_akhir: string | number;
  gap_vs_sgp_awal: number | null;
  gap_vs_sgp_akhir: number | null;
  perubahan_gap_vs_sgp: number | null;
  gap_vs_mys_awal: number | null;
  gap_vs_mys_akhir: number | null;
  perubahan_gap_vs_mys: number | null;
  gap_vs_asean_awal: number | null;
  gap_vs_asean_akhir: number | null;
  perubahan_gap_vs_asean: number | null;
}

export interface IndicatorData {
  indicator_code: string;
  indicator: string;
  arah: Arah;
  ringkasan: Ringkasan;
  series: SeriesRow[];
}

export interface Meta {
  judul: string;
  sumber: string;
  negara: string[];
  catatan: string;
}

export interface WebData {
  meta: Meta;
  indicators: IndicatorData[];
}

const data = raw as unknown as WebData;

export const meta: Meta = data.meta;
export const daftarIndikator: IndicatorData[] = data.indicators;
export const indikator = Object.fromEntries(
  data.indicators.map((i) => [i.indicator_code, i]),
) as Record<string, IndicatorData>;
