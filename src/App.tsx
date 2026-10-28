import { GlassHeader } from "./components/layout/GlassHeader";
import { Hero } from "./sections/Hero";
import { IndikatorSection } from "./sections/IndikatorSection";
import { Penutup } from "./sections/Penutup";
import { Metode } from "./sections/Metode";
import { URUTAN_KODE } from "./lib/konfigurasi";
import { daftarIndikator, meta } from "./lib/data";

export default function App() {
  return (
    <div className="min-h-svh bg-kertas font-sans text-tinta antialiased">
      <GlassHeader />
      <main>
        <Hero />
        {URUTAN_KODE.map((kode) => {
          const ind = daftarIndikator.find((d) => d.indicator_code === kode);
          if (!ind) return null;
          return <IndikatorSection key={kode} ind={ind} />;
        })}
        <Penutup />
        <Metode />
      </main>
      <footer className="border-t border-garis py-10">
        <div className="mx-auto w-full max-w-6xl px-5 text-[13px] leading-5 text-tinta-lembut md:px-8">
          <p>
            {meta.judul}. Sumber: {meta.sumber}. {meta.catatan}
          </p>
          <p className="mt-2">
            Data processed and website developed by{" "}
            <a
              href="https://portofolio.farhanfadhila.web.id/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-tinta underline-offset-2 hover:underline"
            >
              Farhan Fadhila
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
