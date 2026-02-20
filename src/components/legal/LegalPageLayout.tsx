import { ChevronUpCircle } from "lucide-react";
import { useMemo } from "react";

type LegalSection = {
  id: string; // anchor id, e.g. "definitions"
  title: string; // shown in TOC + section header
  content: React.ReactNode;
};

type Props = {
  title: string;
  subtitle?: string;
  effectiveDate: string; // "20 Feb 2026" etc.
  version?: string; // "1.1"
  lastUpdated?: string; // optional
  sections: LegalSection[];
};

export default function LegalPageLayout({
  title,
  subtitle,
  effectiveDate,
  version,
  lastUpdated,
  sections,
}: Props) {
  const toc = useMemo(
    () => sections.map(({ id, title }) => ({ id, title })),
    [sections],
  );

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      {/* Top glow (matches your ContactUs vibe) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-lolo-pink/10 via-lolo-cyan/5 to-transparent blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        {/* Header */}
        <header id="top" className="mb-10 lg:mb-14">
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Legal
          </p>

          <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-4 text-neutral-400 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
              Effective:{" "}
              <span className="ml-2 text-white">{effectiveDate}</span>
            </span>

            {version ? (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
                Version: <span className="ml-2 text-white">{version}</span>
              </span>
            ) : null}

            {lastUpdated ? (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
                Last updated:{" "}
                <span className="ml-2 text-white">{lastUpdated}</span>
              </span>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* TOC */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
              <p className="text-sm font-bold text-neutral-200">On this page</p>

              <nav className="mt-4">
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-xl px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-8">
            <div className="space-y-10">
              {sections.map((s) => (
                <article
                  key={s.id}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8"
                >
                  {/* anchor: keep id on a wrapper, not on the heading text */}
                  <div id={s.id} className="scroll-mt-24" />
                  <h2 className="text-2xl md:text-3xl font-bold">{s.title}</h2>
                  <div className="mt-4 text-neutral-300 leading-relaxed space-y-4">
                    {s.content}
                  </div>{" "}
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Footer note */}
        <footer className="mt-14 text-sm text-neutral-500">
          If you have questions, contact:{" "}
          <span className="text-neutral-300">bandloloplay0707@gmail.com</span>
        </footer>
      </div>
    </main>
  );
}
