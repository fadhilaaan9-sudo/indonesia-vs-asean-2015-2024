// Unduhan data langsung dari data yang sama dengan yang digambar chart.
// File CSV memakai titik sebagai pemisah desimal, supaya bisa dibaca ulang
// oleh spreadsheet dan skrip tanpa menebak format.

import type { IndicatorData } from "./data";

function unduhBlob(nama: string, isi: string, tipe: string): void {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function unduhJson(nama: string, data: unknown): void {
  unduhBlob(nama, JSON.stringify(data, null, 2), "application/json");
}

function selCsv(v: string | number | null | undefined): string {
  if (v == null) return "";
  const s = String(v);
  return s.includes(",") || s.includes('"') ? `"${s.replaceAll('"', '""')}"` : s;
}

export function unduhCsvTren(nama: string, daftar: IndicatorData[]): void {
  const header = [
    "indicator_code",
    "year",
    "IDN",
    "SGP",
    "MYS",
    "rata_asean",
    "n_negara",
    "gap_vs_sgp",
    "gap_vs_mys",
    "gap_vs_asean",
    "peringkat_terbaik",
  ];
  const baris: string[] = [header.join(",")];
  for (const ind of daftar) {
    for (const s of ind.series) {
      baris.push(
        [
          ind.indicator_code,
          s.year,
          s.IDN,
          s.SGP,
          s.MYS,
          s.rata_asean,
          s.n_negara,
          s.gap_vs_sgp,
          s.gap_vs_mys,
          s.gap_vs_asean,
          s.peringkat_terbaik,
        ]
          .map(selCsv)
          .join(","),
      );
    }
  }
  unduhBlob(nama, baris.join("\n"), "text/csv");
}

export function unduhCsvRingkasan(nama: string, daftar: IndicatorData[]): void {
  const header = [
    "indicator_code",
    "indicator",
    "arah",
    "tahun_awal_idn",
    "tahun_akhir_idn",
    "nilai_idn_awal",
    "nilai_idn_akhir",
    "selisih_idn",
    "peringkat_terbaik_awal",
    "peringkat_terbaik_akhir",
    "gap_vs_sgp_awal",
    "gap_vs_sgp_akhir",
    "perubahan_gap_vs_sgp",
    "gap_vs_mys_awal",
    "gap_vs_mys_akhir",
    "perubahan_gap_vs_mys",
    "gap_vs_asean_awal",
    "gap_vs_asean_akhir",
    "perubahan_gap_vs_asean",
  ];
  const baris: string[] = [header.join(",")];
  for (const ind of daftar) {
    const r = ind.ringkasan;
    baris.push(
      header
        .map((k) => selCsv(r[k as keyof typeof r] as string | number | null))
        .join(","),
    );
  }
  unduhBlob(nama, baris.join("\n"), "text/csv");
}
