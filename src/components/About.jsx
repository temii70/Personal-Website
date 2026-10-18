import Reveal from "./ui/Reveal";
import { Caption, ChapterTitle } from "./ui/Chapter";
import Voice from "../art/Voice";
import { Anchor } from "../art/SignalLine";
import { highlights, skills } from "../data";

// Chapter 2 · voice. The line arrives as noise, denoises into speech, and gets transcribed.
export default function About() {
  return (
    <section id="About" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="a voice, once you listen closely">About me</ChapterTitle>

        <div className="relative">
          {/* the line drops in from above at the right end, runs right to left through the waveform
              (which starts and ends on its baseline, 42% down), and leaves down the left margin */}
          <Anchor kind="end" dir="down" x="100%" y="42%" />
          <Anchor kind="start" dir="left" x="0%" y="42%" />
          <Voice className="block h-52 w-full touch-pan-y sm:h-60" />
        </div>
        <Caption className="mt-2">talk over it (move your cursor through) and the transcript falls apart</Caption>

        <div className="mt-20 grid gap-14 md:grid-cols-[1.3fr_1fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              I study Computing Science at the University of Alberta, specializing in AI with a minor in Business. I'm a{" "}
              <mark className="marker text-ink">Jason Lang Scholarship</mark> recipient and on the Dean's List.
            </p>
            <p>
              Most of my work sits where research meets the real world: forecasting, healthcare prediction, language pipelines,
              and lately local LLM agents. I like problems where a better model turns into a number someone actually cares about.
            </p>
            <p>Otherwise you'll find me at the gym, on a basketball court, deep in a manga, or planning the next trip.</p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto w-60 sm:w-72 md:mx-0 md:justify-self-end">
            <figure className="rotate-[2deg]">
              <div className="bg-white p-2.5 shadow-[3px_6px_16px_rgba(58,53,48,0.15)]">
                <img src="/headshot2.webp" alt="Temi Otun" className="aspect-[4/5] w-full object-cover" />
              </div>
              <figcaption className="mt-3 font-mono text-xs lowercase text-ink-soft">me, mid-thought</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-2">
          <Reveal>
            <Caption>numbers i'm proud of</Caption>
            <ul className="mt-5 space-y-5">
              {highlights.map((h) => (
                <li key={h.value} className="flex items-baseline gap-5">
                  <span className="w-36 shrink-0 font-display text-4xl text-blue">{h.value}</span>
                  <span className="leading-snug text-ink-soft">{h.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <Caption>what i work with</Caption>
            <dl className="mt-5 space-y-4">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <dt className="font-mono text-xs lowercase text-pink">{group}</dt>
                  <dd className="mt-0.5 text-ink">{items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
