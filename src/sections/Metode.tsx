import { KONFIG, URUTAN_KODE } from "../lib/konfigurasi";
import { daftarIndikator, meta } from "../lib/data";
import {
  unduhCsvRingkasan,
  unduhCsvTren,
  unduhJson,
} from "../lib/unduh";

const tombol =
  "rounded-chip border border-garis bg-permukaan px-4 py-2.5 text-sm font-medium text-tinta hover:bg-tinta/5";

export function Metode() {
  return (
    <section id="metode" className="border-t border-garis py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <h2 className="font-display text-3xl font-medium leading-tight text-balance text-tinta md:text-4xl">
          Metode dan sumber
        </h2>

        <h3 className="mt-12 font-display text-xl font-medium leading-snug text-tinta md:text-2xl">
          Cara membaca selisih
        </h3>
        <ul className="mt-4 max-w-[62ch] list-disc space-y-2 pl-5 text-base leading-7 text-tinta-lembut">
          <li>
            Selisih dihitung dari arah tiap indikator. Selisih positif berarti
            Indonesia tertinggal dari pembandingnya, selisih negatif berarti
            Indonesia lebih baik. Karena itu selisih yang menyempit selalu
            berarti perubahannya negatif, baik untuk indikator yang
            nilainya makin tinggi makin bagus maupun sebaliknya.
          </li>
          <li>
            Rata-rata ASEAN adalah rata-rata sederhana, tidak dibobot
            populasi, dari negara yang punya data di tahun itu. Jumlah negara
            selalu ditulis bersama rata-rata dan peringkatnya.
          </li>
          <li>
            Tahun tanpa data dibiarkan kosong dan garisnya terputus. Tahun
            kosong bukan nol.
          </li>
          <li>
            Selisih antar-persentase ditulis dalam poin persen, bukan persen.
            Desimal memakai koma mengikuti penulisan Indonesia.
          </li>
        </ul>

        <h3 className="mt-12 font-display text-xl font-medium leading-snug text-tinta md:text-2xl">
          Sumber dan definisi
        </h3>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-tinta-lembut">
          Sumber: {meta.sumber}, terakhir diperbarui 8 Oktober 2026. Data
          diambil lewat API World Bank dan diolah dengan skrip yang sama
          untuk semua indikator. Angka di halaman ini berasal dari file data
          yang sama dengan chart, bukan angka yang diketik tangan.
        </p>
        <dl className="mt-6 max-w-[62ch] space-y-4">
          {URUTAN_KODE.map((kode) => {
            const ind = daftarIndikator.find(
              (d) => d.indicator_code === kode,
            );
            if (!ind) return null;
            const k = KONFIG[kode];
            return (
              <div key={kode}>
                <dt className="font-medium text-tinta">
                  {k.judulPendek}{" "}
                  <code className="text-sm font-normal text-tinta-lembut">
                    {kode}
                  </code>
                </dt>
                <dd className="mt-1 leading-7 text-tinta-lembut">
                  {k.definisi} Definisi dalam bahasa Inggris: {ind.indicator}.
                </dd>
              </div>
            );
          })}
        </dl>

        <h3 className="mt-12 font-display text-xl font-medium leading-snug text-tinta md:text-2xl">
          Batasan
        </h3>
        <ul className="mt-4 max-w-[62ch] list-disc space-y-2 pl-5 text-base leading-7 text-tinta-lembut">
          <li>
            Perbandingan kemiskinan tidak lengkap: Singapura tidak punya data
            sama sekali, dan jumlah negara yang punya data berubah tiap tahun.
            Peringkat kemiskinan antar-tahun tidak sepenuhnya sebanding.
          </li>
          <li>
            PDB per kapita memakai dolar AS berlaku, jadi dipengaruhi kurs dan
            inflasi AS. Angka ini bukan ukuran daya beli yang persis.
          </li>
          <li>
            Pengangguran muda adalah estimasi model ILO, dan definisi antar
            negara bisa berbeda. Halaman ini tidak membuktikan sebab-akibat:
            dua hal yang bergerak bersamaan belum tentu saling menyebabkan.
          </li>
          <li>
            Chart garis di halaman ini menampilkan Indonesia, Singapura,
            Malaysia, dan rata-rata ASEAN, karena hanya itulah yang tersimpan
            di file data. Delapan negara ASEAN lainnya ikut menghitung
            rata-rata, tetapi garisnya masing-masing tidak ditampilkan.
          </li>
        </ul>

        <h3 className="mt-12 font-display text-xl font-medium leading-snug text-tinta md:text-2xl">
          Unduh data
        </h3>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-tinta-lembut">
          Unduh data yang sama dengan yang digambar di halaman ini. File CSV
          memakai titik sebagai pemisah desimal.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className={tombol}
            onClick={() =>
              unduhJson("indonesia-vs-asean.json", {
                meta,
                indicators: daftarIndikator,
              })
            }
          >
            Unduh data JSON
          </button>
          <button
            type="button"
            className={tombol}
            onClick={() => unduhCsvTren("tren-dan-gap.csv", daftarIndikator)}
          >
            Unduh tabel tren dan selisih (CSV)
          </button>
          <button
            type="button"
            className={tombol}
            onClick={() =>
              unduhCsvRingkasan("analisis-ringkasan.csv", daftarIndikator)
            }
          >
            Unduh tabel ringkasan (CSV)
          </button>
        </div>
      </div>
    </section>
  );
}
