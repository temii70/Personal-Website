import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { experience, profile } from "../data";

// A wobbly hand-drawn circle used as the marker on the timeline.
const Marker = () => (
  <svg viewBox="0 0 20 20" className="absolute -left-[9px] top-1.5 h-[18px] w-[18px] bg-paper" aria-hidden>
    <path d="M10 2.5c4.4-.2 7.6 3 7.4 7.3-.2 4.3-3.6 7.6-7.6 7.4C5.7 17 2.6 13.8 2.7 9.9 2.8 5.8 6 2.7 10.6 2.9" fill="none" stroke="#c06a4c" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default function Experience() {
  return (
    <Section id="Experience" title="field notes" aside="where i've worked, and what i learned there">
      <ol className="relative ml-2 border-l border-dashed border-ink/25 sm:ml-40">
        {experience.map((job, i) => (
          <Reveal key={job.company + job.role} delay={i * 0.05}>
            <li className="relative pb-14 pl-8 last:pb-0">
              <Marker />
              <p className="font-hand text-lg text-ink-soft sm:absolute sm:-left-40 sm:top-0 sm:w-32 sm:text-right">{job.dates}</p>
              <h3 className="font-serif text-2xl text-ink">{job.role}</h3>
              <p className="italic text-rust">
                {job.company} <span className="not-italic text-ink-soft">· {job.location}</span>
              </p>
              <ul className="mt-4 max-w-2xl space-y-2 leading-relaxed text-ink-soft">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="select-none font-hand text-thread">~</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-hand text-lg text-moss">{job.tags.map((t) => `#${t.replace(/ /g, "")}`).join("  ")}</p>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-14 sm:ml-40">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="font-hand text-xl text-ink underline decoration-thread decoration-wavy underline-offset-[6px] hover:text-rust"
        >
          the full resume, if you like PDFs →
        </a>
      </Reveal>
    </Section>
  );
}
