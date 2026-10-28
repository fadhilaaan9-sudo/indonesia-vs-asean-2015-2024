import { fmt } from "../../lib/format";
import { kalimat, verdict } from "../../lib/verdict";
import type { Konfig } from "../../lib/konfigurasi";
import type { Ringkasan, SeriesRow } from "../../lib/data";
import { Sparkline } from "./Sparkline";
import { VerdictBadge } from "./VerdictBadge";

interface VerdictCardProps {
  konfig: Konfig;
  ringkasan: Ringkasan;
  series: SeriesRow[];
  fitur?: boolean;
  className?: string;
  catatan?: string;
}

export function VerdictCard({
  konfig,
  ringkasan,
  series,
  fitur = false,
  className = "",
  catatan,
}: VerdictCardProps) {
  const v = verdict(ringkasan, konfig.ambangStagnan);
  const d = konfig.desimal;
  return (
    <article
      className={[
        "flex flex-col justify-between border border-garis bg-permukaan p-6 md:p-8",
        fitur ? "rounded-kartu-besar" : "rounded-kartu",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-medium text-tinta-lembut">
          <a
            href={`#${konfig.slug}`}
            className="hover:text-tinta hover:underline hover:underline-offset-2"
          >
            {konfig.judulPendek}
          </a>
        </h3>
        <VerdictBadge kode={v.kode} />
      </div>

      <p
        className={`mt-6 font-display font-medium leading-tight text-balance text-tinta ${
          fitur ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        }`}
      >
        {kalimat(v, konfig)}
      </p>

      {catatan && (
        <p className="mt-3 text-[13px] leading-5 text-tinta-lembut">{catatan}</p>
      )}

      <div className="mt-8 flex items-end justify-between gap-6">
        <dl className="flex gap-8 tabular-nums">
          <div>
            <dt className="text-[13px] text-tinta-lembut">
              {ringkasan.tahun_awal_idn}
            </dt>
            <dd className="text-2xl font-semibold text-tinta-lembut">
              {fmt(ringkasan.nilai_idn_awal, d)}
              {konfig.satuan}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-tinta-lembut">
              {ringkasan.tahun_akhir_idn}
            </dt>
            <dd className="text-2xl font-semibold text-idn">
              {fmt(ringkasan.nilai_idn_akhir, d)}
              {konfig.satuan}
            </dd>
          </div>
        </dl>
        <Sparkline
          idn={series.map((s) => s.IDN ?? null)}
          asean={series.map((s) => s.rata_asean ?? null)}
          label={`Tren ${konfig.judulPendek.toLowerCase()} Indonesia dan rata-rata ASEAN`}
        />
      </div>
    </article>
  );
}
