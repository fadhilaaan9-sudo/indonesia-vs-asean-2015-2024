import type { ReactNode } from "react";

interface ChartFrameProps {
  judul: string;
  subjudul?: string;
  sumber: string;
  nNegara?: string;
  catatan?: string;
  tabel?: ReactNode;
  children: ReactNode;
}

export function ChartFrame({
  judul,
  subjudul,
  sumber,
  nNegara,
  catatan,
  tabel,
  children,
}: ChartFrameProps) {
  return (
    <figure className="rounded-kartu border border-garis bg-permukaan p-5 md:p-7">
      <figcaption className="max-w-[60ch]">
        <h3 className="font-display text-xl font-medium leading-snug text-balance text-tinta md:text-2xl">
          {judul}
        </h3>
        {subjudul && (
          <p className="mt-2 leading-7 text-tinta-lembut">{subjudul}</p>
        )}
      </figcaption>

      <div className="mt-6">{children}</div>

      <div className="mt-5 border-t border-garis pt-3 text-[13px] leading-5 text-tinta-lembut">
        <p>
          Sumber: {sumber}. Rata-rata ASEAN dihitung dari negara yang punya
          data di tahun tersebut
          {nNegara ? ` (${nNegara})` : ""}.
        </p>
        {catatan && <p className="mt-1">{catatan}</p>}
        {tabel && (
          <details className="mt-2">
            <summary className="cursor-pointer text-tinta underline-offset-2 hover:underline">
              Lihat data sebagai tabel
            </summary>
            <div className="mt-2 overflow-x-auto">{tabel}</div>
          </details>
        )}
      </div>
    </figure>
  );
}
