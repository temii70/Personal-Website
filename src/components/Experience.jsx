import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell, H2 } from "../notebook/Cell";
import { Marked } from "../notebook/outputs";
import { experience, profile } from "../data";

export default function Experience() {
  return (
    <section id="Experience" className="scroll-mt-20 space-y-10 pt-28">
      <MarkdownCell>
        <Reveal>
          <H2>Experience</H2>
          <p className="mt-3 text-lg text-ink-soft">Where I've worked, newest first.</p>
        </Reveal>
      </MarkdownCell>

      <CodeCell
        code={`for job in temi.experience:
    job.summary()`}
      >
        <div className="divide-y divide-dashed divide-line">
          {experience.map((job) => (
            <article key={job.company + job.role} className="py-7 first:pt-0 last:pb-0">
              <p className="font-mono text-xs text-ink-soft">
                {job.dates} · {job.location}
              </p>
              <h3 className="mt-1.5 font-display text-2xl text-ink">{job.role}</h3>
              <p className="italic text-pen">{job.company}</p>
              <ul className="mt-4 max-w-2xl space-y-2 leading-relaxed text-ink-soft">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="select-none text-orange">–</span>
                    <span>
                      <Marked text={p} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-xs text-ink-soft">tags = [{job.tags.map((t) => `'${t}'`).join(", ")}]</p>
            </article>
          ))}
        </div>
      </CodeCell>

      <MarkdownCell>
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] text-ink underline decoration-orange underline-offset-4 hover:text-orange"
        >
          → the full resume, if you like PDFs
        </a>
      </MarkdownCell>
    </section>
  );
}
