// Satu section per indikator. Teks langkah scrolly dihitung dari data
// (ringkasan dan series), bukan angka yang diketik tangan.

import { fmt } from "../lib/format";
import { KONFIG } from "../lib/konfigurasi";
import type { Konfig } from "../lib/konfigurasi";
import { meta } from "../lib/data";
import type { IndicatorData, Ringkasan, SeriesRow } from "../lib/data";
import { kalimat, verdict } from "../lib/verdict";
import { Scrolly } from "../components/scrolly/Scrolly";
import type { LangkahScrolly } from "../components/scrolly/Scrolly";
import { ChartFrame } from "../components/charts/ChartFrame";
import { GarisVsAsean } from "../components/charts/GarisVsAsean";
import { GrafikSelisih } from "../components/charts/GrafikSelisih";
import { VerdictBadge } from "../components/bento/VerdictBadge";

function teksNegara(series: SeriesRow[]): string {
  const awal = series[0];
  const akhir = series[series.length - 1];
  if (awal.n_negara === akhir.n_negara) {
    return `${awal.n_negara} negara pada ${awal.year} dan ${akhir.year}`;
  }
  return `${awal.n_negara} negara pada ${awal.year}, ${akhir.n_negara} negara pada ${akhir.year}`;
}

function teksPeringkat(r: Ringkasan, series: SeriesRow[]): string {
  const awal = series[0];
  const akhir = series[series.length - 1];
  let t = `Peringkat Indonesia ${r.peringkat_terbaik_awal} dari ${awal.n_negara} pada ${r.tahun_awal_idn} dan ${r.peringkat_terbaik_akhir} dari ${akhir.n_negara} pada ${r.tahun_akhir_idn}.`;
  if (
    String(r.peringkat_terbaik_awal) === String(r.peringkat_terbaik_akhir)
  ) {
    t += " Peringkatnya tidak berubah.";
  }
  if (awal.n_negara !== akhir.n_negara) {
    t +=
      " Jumlah negara berubah, jadi peringkat antar-tahun tidak sepenuhnya sebanding.";
  }
  return t;
}

function langkahUntuk(ind: IndicatorData, k: Konfig): LangkahScrolly[] {
  const r = ind.ringkasan;
  const s = ind.series;
  const v = verdict(r, k.ambangStagnan);
  const adaSGP = s.some((x) => x.SGP != null);
  const adaMYS = s.some((x) => x.MYS != null);
  const pembanding =
    adaSGP && adaMYS
      ? "Singapura dan Malaysia"
      : adaMYS
        ? "Malaysia"
        : adaSGP
          ? "Singapura"
          : "tidak ada pembanding";
  let teks0 =
    adaSGP || adaMYS
      ? `Garis abu-abu adalah ${pembanding}. Garis putus-putus adalah rata-rata ASEAN, yang dihitung dari negara yang punya data di tahun itu.`
      : "Tidak ada garis pembanding untuk indikator ini: tidak satu pun negara pembanding yang punya data.";
  if (!adaSGP && adaMYS) {
    teks0 += " Singapura tidak punya data untuk indikator ini.";
  }
  const abuTerputus =
    (adaSGP && s.some((x) => x.SGP == null)) ||
    (adaMYS && s.some((x) => x.MYS == null));
  if (abuTerputus) {
    teks0 +=
      " Pembanding tidak punya data di semua tahun, jadi garisnya terputus di tahun yang kosong.";
  }
  if (s[0].n_negara !== s[s.length - 1].n_negara) {
    teks0 += ` Jumlah negara yang punya data berubah dari ${s[0].n_negara} pada ${s[0].year} menjadi ${s[s.length - 1].n_negara} pada ${s[s.length - 1].year}.`;
  }

  const verb =
    r.selisih_idn > 0 ? "naik" : r.selisih_idn < 0 ? "turun" : "tidak berubah";
  const teks1 = `Indonesia ${verb} dari ${fmt(r.nilai_idn_awal, k.desimal)}${k.satuan} pada ${r.tahun_awal_idn} menjadi ${fmt(r.nilai_idn_akhir, k.desimal)}${k.satuan} pada ${r.tahun_akhir_idn}, perubahan ${fmt(Math.abs(r.selisih_idn), k.desimal)} ${k.satuanSelisih}.`;

  const teks2 = `${kalimat(v, k)} ${teksPeringkat(r, s)}`;

  let teks3 =
    "Chart selisih memperlihatkan jarak Indonesia ke rata-rata ASEAN dari tahun ke tahun. Garis nol berarti sejajar rata-rata ASEAN.";
  if (r.gap_vs_sgp_akhir != null) {
    teks3 += ` Selisih dengan Singapura masih ${fmt(r.gap_vs_sgp_akhir, k.desimal)} ${k.satuanSelisih} pada ${r.tahun_akhir_idn}.`;
  } else {
    teks3 +=
      " Selisih dengan Singapura tidak dapat dihitung, karena Singapura tidak punya data untuk indikator ini.";
  }
  if (k.peringatan) {
    teks3 += ` ${k.peringatan}`;
  }

  return [
    { id: "pembanding", judul: "Garis pembanding", teks: teks0 },
    { id: "indonesia", judul: "Indonesia", teks: teks1 },
    {
      id: "rata-rata",
      judul: "Dibandingkan dengan rata-rata ASEAN",
      teks: teks2,
    },
    { id: "selisih", judul: "Selisihnya menyempit atau melebar?", teks: teks3 },
  ];
}

function judulKlaim(ind: IndicatorData, k: Konfig): string {
  const r = ind.ringkasan;
  const verb =
    r.selisih_idn > 0 ? "naik" : r.selisih_idn < 0 ? "turun" : "tidak berubah";
  return `${k.judulPendek} Indonesia ${verb} ${fmt(Math.abs(r.selisih_idn), k.desimal)} ${k.satuanSelisih} sejak ${r.tahun_awal_idn}`;
}

function TabelData({
  series,
  konfig,
}: {
  series: SeriesRow[];
  konfig: Konfig;
}) {
  const sel = (v: number | null) =>
    v == null ? "tidak ada data" : fmt(v, konfig.desimal);
  return (
    <div>
      <p className="mb-2 text-[13px] leading-5">
        Nilai dalam {konfig.satuanSelisih === "poin persen" ? "%" : konfig.satuan}
        {konfig.satuanSelisih === "poin persen"
          ? ", selisih dalam poin persen"
          : `, selisih dalam ${konfig.satuanSelisih}`}
        . Sel kosong berarti tidak ada data, bukan nol.
      </p>
      <table className="w-full min-w-[560px] text-left text-sm tabular-nums">
        <caption className="sr-only">
          Data tahunan {konfig.judulPendek.toLowerCase()}
        </caption>
        <thead>
          <tr className="border-b border-garis text-tinta-lembut">
            <th scope="col" className="py-2 pr-4 font-medium">
              Tahun
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Indonesia
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Singapura
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Malaysia
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Rata-rata ASEAN
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Selisih vs ASEAN
            </th>
            <th scope="col" className="py-2 font-medium">
              n
            </th>
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr
              key={s.year}
              className="border-b border-garis/60 last:border-b-0"
            >
              <th scope="row" className="py-2 pr-4 font-medium text-tinta">
                {s.year}
              </th>
              <td className="py-2 pr-4">{sel(s.IDN)}</td>
              <td className="py-2 pr-4">{sel(s.SGP)}</td>
              <td className="py-2 pr-4">{sel(s.MYS)}</td>
              <td className="py-2 pr-4">{sel(s.rata_asean)}</td>
              <td className="py-2 pr-4">{sel(s.gap_vs_asean)}</td>
              <td className="py-2">{s.n_negara}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function IndikatorSection({ ind }: { ind: IndicatorData }) {
  const k = KONFIG[ind.indicator_code];
  const r = ind.ringkasan;
  const v = verdict(r, k.ambangStagnan);
  const langkah = langkahUntuk(ind, k);
  const catatan = `Tahun tanpa data tampil sebagai celah, bukan nol.${k.peringatan ? ` ${k.peringatan}` : ""}`;
  const tabel = <TabelData series={ind.series} konfig={k} />;

  return (
    <section id={k.slug} className="border-t border-garis py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <VerdictBadge kode={v.kode} />
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-balance text-tinta md:text-4xl">
          {k.pertanyaan}
        </h2>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-tinta-lembut">
          {k.definisi} {kalimat(v, k)}
        </p>
        <div className="mt-12">
          <Scrolly
            langkah={langkah}
            renderChart={(a) =>
              a < 3 ? (
                <ChartFrame
                  judul={judulKlaim(ind, k)}
                  sumber={meta.sumber}
                  nNegara={teksNegara(ind.series)}
                  catatan={catatan}
                  tabel={tabel}
                >
                  <div className="h-[170px] sm:h-[230px] lg:h-[320px]">
                    <GarisVsAsean
                      data={ind.series}
                      tampilIdn
                      tampilMedian
                      satuan={k.satuan}
                      desimal={k.desimal}
                      label={`Tren ${k.judulPendek.toLowerCase()} Indonesia, Singapura, Malaysia, dan rata-rata ASEAN, 2015 sampai 2024`}
                    />
                  </div>
                </ChartFrame>
              ) : (
                <ChartFrame
                  judul={kalimat(v, k)}
                  sumber={meta.sumber}
                  nNegara={teksNegara(ind.series)}
                  catatan={catatan}
                  tabel={tabel}
                >
                  <div className="h-[170px] sm:h-[230px] lg:h-[320px]">
                    <GrafikSelisih
                      data={ind.series}
                      satuanSelisih={k.satuanSelisih}
                      desimal={k.desimal}
                      label={`Selisih ${k.judulPendek.toLowerCase()} Indonesia dengan rata-rata ASEAN, 2015 sampai 2024`}
                    />
                  </div>
                </ChartFrame>
              )
            }
          />
        </div>
      </div>
    </section>
  );
}
