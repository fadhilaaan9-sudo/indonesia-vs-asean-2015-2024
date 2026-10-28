import { fmt } from "../lib/format";
import { KONFIG, URUTAN_KODE } from "../lib/konfigurasi";
import { daftarIndikator } from "../lib/data";
import { verdict } from "../lib/verdict";
import { VerdictBadge } from "../components/bento/VerdictBadge";

export function Penutup() {
  const baris = URUTAN_KODE.flatMap((kode) => {
    const ind = daftarIndikator.find((d) => d.indicator_code === kode);
    if (!ind) return [];
    return [
      {
        kode,
        k: KONFIG[kode],
        ind,
        v: verdict(ind.ringkasan, KONFIG[kode].ambangStagnan),
      },
    ];
  });

  return (
    <section className="border-t border-garis py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <h2 className="font-display text-3xl font-medium leading-tight text-balance text-tinta md:text-4xl">
          Tidak ada satu jawaban untuk keenam indikator.
        </h2>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-tinta-lembut">
          Lima selisih terhadap rata-rata ASEAN menyempit antara 2015 dan
          2024, satu melebar. Tabel ini merangkum semuanya dalam satu tempat,
          dengan peringkat yang selalu ditulis bersama jumlah negaranya.
        </p>

        <div className="mt-10 overflow-x-auto rounded-kartu border border-garis bg-permukaan">
          <table className="w-full min-w-[720px] text-left text-sm tabular-nums">
            <caption className="sr-only">
              Ringkasan lintas indikator, 2015 sampai 2024
            </caption>
            <thead>
              <tr className="border-b border-garis text-tinta-lembut">
                <th scope="col" className="px-5 py-3 font-medium">
                  Indikator
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Indonesia
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Selisih vs ASEAN
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Verdict
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Peringkat
                </th>
              </tr>
            </thead>
            <tbody>
              {baris.map(({ kode, k, ind, v }) => {
                const r = ind.ringkasan;
                const awal = ind.series[0];
                const akhir = ind.series[ind.series.length - 1];
                return (
                  <tr
                    key={kode}
                    className="border-b border-garis/60 last:border-b-0"
                  >
                    <th scope="row" className="px-5 py-3 font-medium text-tinta">
                      <a
                        href={`#${k.slug}`}
                        className="hover:underline hover:underline-offset-2"
                      >
                        {k.judulPendek}
                      </a>
                    </th>
                    <td className="px-5 py-3">
                      {fmt(r.nilai_idn_awal, k.desimal)}
                      {k.satuan} menjadi {fmt(r.nilai_idn_akhir, k.desimal)}
                      {k.satuan}
                    </td>
                    <td className="px-5 py-3">
                      {v.awal == null || v.akhir == null
                        ? "tidak dapat dihitung"
                        : `${fmt(Math.abs(v.awal), k.desimal)} menjadi ${fmt(Math.abs(v.akhir), k.desimal)} ${k.satuanSelisih}`}
                    </td>
                    <td className="px-5 py-3">
                      <VerdictBadge kode={v.kode} />
                    </td>
                    <td className="px-5 py-3">
                      {r.peringkat_terbaik_awal} dari {awal.n_negara} menjadi{" "}
                      {r.peringkat_terbaik_akhir} dari {akhir.n_negara}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-12 max-w-[62ch] text-center font-display text-2xl font-medium leading-snug text-balance text-tinta md:text-3xl">
          Mengejar di sebagian indikator, tertinggal di sebagian lain. Itu
          gambaran 2015–2024.
        </p>
        <p className="mt-6 text-center">
          <a
            href="#metode"
            className="text-tinta underline underline-offset-2 hover:underline"
          >
            Baca metode dan batasan datanya
          </a>
        </p>
      </div>
    </section>
  );
}
