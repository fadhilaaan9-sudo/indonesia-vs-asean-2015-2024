import { BentoGrid } from "../components/bento/BentoGrid";
import { VerdictCard } from "../components/bento/VerdictCard";
import { KONFIG } from "../lib/konfigurasi";
import { daftarIndikator, meta } from "../lib/data";

function kartu(
  kode: string,
  className: string,
  fitur = false,
  catatan?: string,
) {
  const ind = daftarIndikator.find((d) => d.indicator_code === kode);
  if (!ind) return null;
  return (
    <VerdictCard
      key={kode}
      konfig={KONFIG[kode]}
      ringkasan={ind.ringkasan}
      series={ind.series}
      fitur={fitur}
      className={className}
      catatan={catatan}
    />
  );
}

export function Hero() {
  return (
    <section id="atas" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <h1 className="max-w-[20ch] font-display text-4xl font-medium leading-[1.05] tracking-tight text-balance text-tinta md:text-6xl">
          {meta.judul}
        </h1>
        <p className="mt-6 max-w-[62ch] text-base leading-7 text-tinta-lembut">
          Lima dari enam selisih terhadap rata-rata ASEAN menyempit; satu, PDB
          per kapita, melebar. Jawabannya tidak satu untuk semua indikator,
          dan tiap bagian di bawah menunjukkan buktinya.
        </p>
        <p className="mt-3 text-[13px] leading-5 text-tinta-lembut">
          Sumber: {meta.sumber}. Data 2015–2024, 10 negara ASEAN. Rata-rata
          ASEAN dihitung dari negara yang punya data di tahun itu.
        </p>
        <div className="mt-12">
          <BentoGrid>
            {kartu(
              "IT.NET.USER.ZS",
              "md:col-span-6 lg:col-span-7 lg:row-span-2",
              true,
            )}
            {kartu(
              "SI.POV.DDAY",
              "md:col-span-3 lg:col-span-5",
              false,
              "Perbandingan tidak lengkap, jumlah negara berubah tiap tahun.",
            )}
            {kartu("SL.UEM.1524.ZS", "md:col-span-3 lg:col-span-5")}
            {kartu("SP.DYN.LE00.IN", "md:col-span-2 lg:col-span-4")}
            {kartu("SH.DYN.MORT", "md:col-span-2 lg:col-span-4")}
            {kartu("NY.GDP.PCAP.CD", "md:col-span-2 lg:col-span-4")}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
