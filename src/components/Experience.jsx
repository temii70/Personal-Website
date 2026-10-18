import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { Marked } from "./ui/Notebook";
import { experience, profile } from "../data";

// Ruled notebook page: dates live in the margin, left of the red margin line.
export default function Experience() {
  return (
    <Section id="Experience" page="03" label="field notes" title="Where I've worked" paper="ruled">
      <div className="relative">
        <span aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-signal/50 sm:left-40 sm:block" />

        <ol className="space-y-16">
          {experience.map((job, i) => (
            <Reveal key={job.company + job.role} delay={i * 0.05}>
              <li className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <p className="pt-1.5 font-mono text-xs uppercase tracking-wider text-ink-soft sm:pr-6 sm:text-right">
                  {job.dates}
                  <span className="block normal-case tracking-normal text-ink-soft/70">{job.location}</span>
                </p>
                <div className="sm:pl-8">
                  <h3 className="font-display text-2xl text-ink">{job.role}</h3>
                  <p className="font-hand text-lg text-pen">{job.company}</p>
                  <ul className="mt-4 max-w-2xl space-y-2.5 leading-relaxed text-ink-soft">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="select-none text-signal">–</span>
                        <span>
                          <Marked text={p} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink-soft">{job.tags.join(" / ")}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 sm:pl-48">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-[0.15em] text-ink underline decoration-signal underline-offset-4 hover:text-signal"
          >
            full resume (pdf) ↗
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
