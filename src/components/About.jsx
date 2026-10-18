import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { Photo } from "./ui/Notebook";
import LearningCurve from "../art/LearningCurve";
import { highlights, skills } from "../data";

export default function About() {
  return (
    <Section id="About" page="02" label="about" title="A little about me" paper="dots">
      <div className="grid gap-14 md:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            I study Computing Science at the University of Alberta, specializing in AI with a minor in Business. I'm a{" "}
            <mark className="marker text-ink">Jason Lang Scholarship</mark> recipient and on the Dean's List.
          </p>
          <p>
            Most of my work sits where research meets the real world: forecasting, healthcare prediction, language pipelines, and
            lately local LLM agents. I like problems where a better model turns into a number someone actually cares about.
          </p>
          <p>Otherwise you'll find me at the gym, on a basketball court, deep in a manga, or planning the next trip.</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto w-56 sm:w-64 md:mx-0 md:justify-self-end">
          <Photo src="/headshot2.webp" alt="Temi Otun" caption="fig. 1 — the author, mid-thought" rotate={2} />
        </Reveal>
      </div>

      <div className="mt-20 grid gap-14 md:grid-cols-2">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">table 1 — results worth highlighting</p>
          <table className="mt-4 w-full border-t border-ink text-left">
            <tbody>
              {highlights.map((h) => (
                <tr key={h.value} className="border-b border-ink/15">
                  <td className="whitespace-nowrap py-3 pr-4 align-top font-display text-2xl text-ink">
                    <mark className="marker">{h.value}</mark>
                  </td>
                  <td className="py-3 text-sm leading-snug text-ink-soft">{h.label}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">appendix — toolbox</p>
          <dl className="mt-4 space-y-3 text-sm">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group} className="grid grid-cols-[7rem_1fr] gap-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-signal">{group}</dt>
                <dd className="text-ink">{items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">fig. 2 — my learning curve (so far)</p>
          <LearningCurve className="mt-4 w-full" />
        </Reveal>
      </div>
    </Section>
  );
}
