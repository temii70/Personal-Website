import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import Figure from "../art/Figure";
import { Anchor } from "../art/SignalLine";
import { palette } from "../theme";
import { projects } from "../data";

// Chapter 5 · the line. The signal becomes a clothesline and the projects hang from it.

const SAG = 58; // how far the line droops at the middle, px
const LINE_Y = 14;
const sagAt = (t) => LINE_Y + 2 * t * (1 - t) * SAG; // quadratic bezier with its control at the middle
const TILT = [-1.5, 1.2, -0.8, 1.6, -1.1];

function Card({ project, index }) {
  const body = (
    <article
      className="relative mx-auto max-w-sm origin-top rotate-[var(--r)] transition-transform duration-500 group-hover:rotate-0"
      style={{ "--r": `${TILT[index % TILT.length]}deg` }}
    >
      {/* the clothes peg */}
      <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-7 w-3 -translate-x-1/2 rounded-[2px] bg-yellow shadow-[1px_1px_0_rgba(58,53,48,0.25)]" />
      <div className="bg-white p-5 shadow-[3px_6px_14px_rgba(58,53,48,0.13)] sm:p-6">
        <Figure kind={project.figure} seed={project.name} className={project.featured ? "h-24 w-24" : "h-16 w-16"} />
        <h3 className={`mt-3 font-display leading-tight text-ink ${project.featured ? "text-3xl" : "text-2xl"}`}>{project.name}</h3>
        <p className="mt-2 leading-relaxed text-ink-soft">{project.description}</p>
        <div className="mt-4 flex items-end justify-between gap-3 font-mono text-xs lowercase">
          <span className="text-ink-soft">{project.tags.join(" · ")}</span>
          {project.link && <span className="shrink-0 text-blue group-hover:underline">have a look ↗</span>}
        </div>
      </div>
    </article>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  ) : (
    <div className="group">{body}</div>
  );
}

// One length of line with cards pegged along it. `reverse` runs it right to left so the
// signal can zig-zag down the page from one line to the next.
function Clothesline({ items, offset, reverse = false }) {
  const n = items.length;
  return (
    <div className="relative pt-1">
      <svg aria-hidden className="absolute inset-x-0 top-0 h-20 w-full overflow-visible" viewBox="0 0 1000 80" preserveAspectRatio="none">
        <path d={`M0,${LINE_Y} Q500,${LINE_Y + 2 * SAG} 1000,${LINE_Y}`} transform="translate(0 2)" fill="none" stroke={palette.misprint} strokeOpacity="0.55" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path d={`M0,${LINE_Y} Q500,${LINE_Y + 2 * SAG} 1000,${LINE_Y}`} fill="none" stroke={palette.blue} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <Anchor kind="end" dir={reverse ? "left" : "right"} x={reverse ? "100%" : "0%"} y={`${LINE_Y}px`} />
      <Anchor kind="start" dir="down" x={reverse ? "0%" : "100%"} y={`${LINE_Y}px`} />

      <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {items.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="pb-4">
            <div style={{ paddingTop: sagAt((i + 0.5) / n) - 6 }}>
              <Card project={p} index={offset + i} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="Projects" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="things i've made, hung up to dry">Projects</ChapterTitle>

        {/* wide screens: two lines of cards */}
        <div className="hidden space-y-16 md:block">
          <Clothesline items={featured} offset={0} />
          <Clothesline items={rest} offset={featured.length} reverse />
        </div>

        {/* phones: one card per line, zig-zagging */}
        <div className="space-y-12 md:hidden">
          {projects.map((p, i) => (
            <Clothesline key={p.name} items={[p]} offset={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
