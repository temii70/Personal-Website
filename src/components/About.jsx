import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { PaperNote } from "./ui/Paper";
import Sunflower from "../art/Sunflower";
import { highlights, skills } from "../data";

export default function About() {
  return (
    <Section id="About" title="a little about me" bg="blush">
      <div className="grid gap-14 md:grid-cols-[1.15fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            I study Computing Science at the University of Alberta, specializing in AI with a minor in Business. I'm a Jason Lang
            Scholarship recipient and on the Dean's List.
          </p>
          <p>
            Most of my work sits where research meets the real world: forecasting, healthcare prediction, language pipelines, and
            lately local LLM agents. I like problems where a better model turns into a number someone actually cares about.
          </p>
          <p>Otherwise you'll find me at the gym, on a basketball court, deep in a manga, or planning the next trip.</p>

          <figure className="flex items-center gap-5 pt-6">
            <Sunflower className="h-28 w-28 shrink-0" />
            <figcaption className="font-hand text-lg leading-snug text-ink-soft">
              280 seeds, each turned 137.5° from the last.
              <br />
              sunflowers do it too. patterns keep finding me.
            </figcaption>
          </figure>
        </Reveal>

        <div className="space-y-10">
          <Reveal delay={0.1}>
            <PaperNote seed="numbers" rotate={-1.5}>
              <p className="font-hand text-xl text-ink-soft">a few numbers i'm proud of</p>
              <ul className="mt-4 space-y-4">
                {highlights.map((h) => (
                  <li key={h.value} className="flex items-baseline gap-4">
                    <span className="w-28 shrink-0 font-serif text-3xl text-ink">{h.value}</span>
                    <span className="text-sm leading-snug text-ink-soft">{h.label}</span>
                  </li>
                ))}
              </ul>
            </PaperNote>
          </Reveal>

          <Reveal delay={0.2}>
            <PaperNote seed="toolbox" rotate={1.2}>
              <p className="font-hand text-xl text-ink-soft">my toolbox</p>
              <dl className="mt-4 space-y-3 text-sm">
                {Object.entries(skills).map(([group, items]) => (
                  <div key={group}>
                    <dt className="font-hand text-lg text-rust">{group}</dt>
                    <dd className="text-ink">{items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </PaperNote>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
