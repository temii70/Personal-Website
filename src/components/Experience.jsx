import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import Forecast from "../art/Forecast";
import { experience, profile } from "../data";

// Marker-highlight ==key numbers== in a sentence.
function Marked({ text }) {
  return text.split(/(==[^=]+==)/g).map((part, i) =>
    part.startsWith("==") ? (
      <mark key={i} className="marker text-ink">
        {part.slice(2, -2)}
      </mark>
    ) : (
      part
    )
  );
}

// Chapter 3 · forecast. The line becomes a career curve with a forecast for what's next.
export default function Experience() {
  return (
    <section id="Experience" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="four jobs, one trend line">Experience</ChapterTitle>

        <Forecast jobs={experience} />

        <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {experience.map((job, i) => (
            <Reveal key={job.company + job.role} delay={(i % 2) * 0.08}>
              <article>
                <p className="font-mono text-xs lowercase text-ink-soft">
                  <span className="text-pink">{job.short}</span> · {job.dates} · {job.location}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink">{job.role}</h3>
                <p className="italic text-blue">{job.company}</p>
                <ul className="mt-4 space-y-2 leading-relaxed text-ink-soft">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="select-none font-mono text-pink">~</span>
                      <span>
                        <Marked text={p} />
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm lowercase text-ink underline decoration-pink decoration-2 underline-offset-4 hover:text-blue"
          >
            the full resume, if you like pdfs ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
