import Reveal from "./Reveal";

const PAPER = { graph: "paper-graph", dots: "paper-dots", ruled: "paper-ruled", plain: "bg-paper" };

// One page of the notebook: a paper pattern, a page number, and a title.
export default function Section({ id, page, label, title, paper = "plain", className = "", children }) {
  return (
    <section id={id} className={`relative scroll-mt-16 border-t border-ink/10 py-24 sm:py-32 ${PAPER[paper]} ${className}`}>
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-12">
        {title && (
          <Reveal className="mb-14">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
              p.{page} — {label}
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">{title}</h2>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
