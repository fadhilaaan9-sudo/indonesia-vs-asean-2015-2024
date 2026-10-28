// Scrollytelling: teks di kiri, chart sticky di kanan (desktop).
// Mobile: chart sticky di atas, teks mengalir di bawahnya. Langkah aktif
// ditandai garis merah di tepi kiri, bukan dengan meredupkan teks lain.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface LangkahScrolly {
  id: string;
  judul: string;
  teks: string;
}

interface LangkahProps {
  index: number;
  aktif: boolean;
  onAktif: (index: number) => void;
  children: ReactNode;
}

function Langkah({ index, aktif, onAktif, children }: LangkahProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) onAktif(index);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onAktif]);

  return (
    <div
      ref={ref}
      data-aktif={aktif}
      className="flex min-h-[65svh] items-center border-l-2 border-transparent py-10 pl-5 transition-colors data-[aktif=true]:border-idn"
    >
      <div>{children}</div>
    </div>
  );
}

interface ScrollyProps {
  langkah: LangkahScrolly[];
  renderChart: (aktif: number) => ReactNode;
}

export function Scrolly({ langkah, renderChart }: ScrollyProps) {
  const [aktif, setAktif] = useState(0);
  const pilih = useCallback((i: number) => setAktif(i), []);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="sticky top-14 z-10 -mx-5 h-[54svh] min-h-[400px] bg-kertas px-5 py-3 md:-mx-8 md:px-8 lg:order-2 lg:col-span-7 lg:top-24 lg:mx-0 lg:h-auto lg:px-0">
        {renderChart(aktif)}
      </div>

      <div className="lg:order-1 lg:col-span-5">
        {langkah.map((l, i) => (
          <Langkah key={l.id} index={i} aktif={aktif === i} onAktif={pilih}>
            <h3 className="font-display text-2xl font-medium leading-snug text-balance text-tinta md:text-3xl">
              {l.judul}
            </h3>
            <p className="mt-3 max-w-[52ch] leading-7 text-tinta-lembut">
              {l.teks}
            </p>
          </Langkah>
        ))}
      </div>
    </div>
  );
}
