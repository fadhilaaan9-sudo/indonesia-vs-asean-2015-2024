// Satu entri per indikator. Menambah indikator baru cukup menambah entri di
// sini, bukan dengan menyalin komponen.

export interface Konfig {
  slug: string;
  judulPendek: string;
  pertanyaan: string;
  satuan: string;
  satuanSelisih: string;
  ambangStagnan: number;
  desimal: number;
  definisi: string;
  peringatan?: string;
}

export const KONFIG: Record<string, Konfig> = {
  "IT.NET.USER.ZS": {
    slug: "internet",
    judulPendek: "Akses internet",
    pertanyaan: "Apakah akses internet Indonesia mengejar ASEAN?",
    satuan: "%",
    satuanSelisih: "poin persen",
    ambangStagnan: 0.5,
    desimal: 1,
    definisi: "Persentase penduduk yang menggunakan internet.",
  },
  "SI.POV.DDAY": {
    slug: "kemiskinan",
    judulPendek: "Kemiskinan",
    pertanyaan: "Apakah kemiskinan Indonesia mengejar ASEAN?",
    satuan: "%",
    satuanSelisih: "poin persen",
    ambangStagnan: 0.5,
    desimal: 1,
    definisi:
      "Persentase penduduk di bawah garis kemiskinan 3,00 dolar AS per hari (PPP 2021).",
    peringatan:
      "Perbandingan tidak lengkap: Singapura tidak punya data sama sekali untuk indikator ini, dan jumlah negara yang punya data berubah tiap tahun (5 negara pada 2015, 3 negara pada 2024). Peringkat antar-tahun tidak sepenuhnya sebanding.",
  },
  "SL.UEM.1524.ZS": {
    slug: "pengangguran-muda",
    judulPendek: "Pengangguran muda",
    pertanyaan: "Apakah pengangguran muda Indonesia mengejar ASEAN?",
    satuan: "%",
    satuanSelisih: "poin persen",
    ambangStagnan: 0.5,
    desimal: 1,
    definisi:
      "Pengangguran usia 15–24 tahun, persentase dari angkatan kerja usia tersebut (estimasi model ILO).",
  },
  "SP.DYN.LE00.IN": {
    slug: "harapan-hidup",
    judulPendek: "Harapan hidup",
    pertanyaan: "Apakah harapan hidup Indonesia mengejar ASEAN?",
    satuan: " tahun",
    satuanSelisih: "tahun",
    ambangStagnan: 0.5,
    desimal: 1,
    definisi: "Harapan hidup saat lahir, total, dalam tahun.",
  },
  "SH.DYN.MORT": {
    slug: "kematian-balita",
    judulPendek: "Kematian balita",
    pertanyaan: "Apakah kematian balita Indonesia mengejar ASEAN?",
    satuan: " per 1.000",
    satuanSelisih: "per 1.000 kelahiran hidup",
    ambangStagnan: 0.5,
    desimal: 1,
    definisi: "Angka kematian balita per 1.000 kelahiran hidup.",
  },
  "NY.GDP.PCAP.CD": {
    slug: "pdb-per-kapita",
    judulPendek: "PDB per kapita",
    pertanyaan: "Apakah PDB per kapita Indonesia mengejar ASEAN?",
    satuan: " US$",
    satuanSelisih: "US$",
    ambangStagnan: 100,
    desimal: 0,
    definisi:
      "PDB per kapita dalam dolar AS berlaku (nominal, bukan paritas daya beli).",
    peringatan:
      "Angka dalam dolar AS berlaku: dipengaruhi kurs dan inflasi AS, bukan ukuran daya beli yang persis.",
  },
};

// Urutan tampil indikator di halaman, dari atas ke bawah.
export const URUTAN_KODE = [
  "IT.NET.USER.ZS",
  "SI.POV.DDAY",
  "SL.UEM.1524.ZS",
  "SP.DYN.LE00.IN",
  "SH.DYN.MORT",
  "NY.GDP.PCAP.CD",
];
