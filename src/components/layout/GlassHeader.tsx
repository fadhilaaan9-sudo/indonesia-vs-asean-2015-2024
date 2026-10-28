const NAV: Array<[string, string]> = [
  ["Internet", "#internet"],
  ["Kemiskinan", "#kemiskinan"],
  ["Pengangguran muda", "#pengangguran-muda"],
  ["Harapan hidup", "#harapan-hidup"],
  ["Kematian balita", "#kematian-balita"],
  ["PDB per kapita", "#pdb-per-kapita"],
  ["Metode", "#metode"],
];

export function GlassHeader() {
  return (
    <header className="kaca sticky top-0 z-40 border-b border-white/60 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-5 md:px-8">
        <a href="#atas" className="font-display text-lg font-medium text-tinta">
          Indonesia vs ASEAN
        </a>
        <nav
          aria-label="Bagian halaman"
          className="-mr-2 flex gap-1 overflow-x-auto"
        >
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-chip px-3 py-2 text-sm text-tinta-lembut hover:bg-tinta/5 hover:text-tinta"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
