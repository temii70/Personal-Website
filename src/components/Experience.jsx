import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import Forecast from "../art/Forecast";
import { Vias } from "../art/SignalLine";
import { experience, profile } from "../data";
import Out from "./ui/Out";

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

// The company line, with any part that has a link (e.g. "Amplify") linked out.
function Company({ job }) {
  return job.company.split(" · ").map((part, i) => (
    <span key={part}>
      {i > 0 && " · "}
      {job.links?.[part] ? (
        <a
          href={job.links[part]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-blue/40 decoration-1 underline-offset-4 transition hover:text-pink hover:decoration-pink"
        >
          {part}
          <Out />
        </a>
      ) : (
        part
      )}
    </span>
  ));
}

// After the forecast the line runs down the right margin past the jobs, then sweeps left
// through the open space below the resume link, toward the sampler. Relative to that link's row.
const AFTER = [
  ["104%", "-110px"],
  ["82%", "-6px"],
  ["52%", "92px"],
  ["12%", "170px"],
];

// Chapter 3 · forecast. The line becomes a career curve with a forecast for what's next.
export default function Experience() {
  return (
    <section id="Experience" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="four jobs, one trend line">Experience</ChapterTitle>

        {/* phones: down the left margin past the heading, then into the top of the chart */}
        <div className="relative">
          <Vias points={[["-3%", "-90px"], ["-2%", "-30px"], ["16%", "-4px"]]} className="md:hidden" />
        </div>
        <Forecast jobs={experience} />
        {/* phones: out of the chart and over to the right margin, clear of the job text */}
        <div className="relative">
          <Vias points={[["104%", "40px"]]} className="md:hidden" />
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {experience.map((job, i) => (
            <Reveal key={job.company + job.role} delay={(i % 2) * 0.08}>
              <article>
                <p className="font-mono text-xs lowercase text-ink-soft">
                  <span className="text-pink">{job.short}</span> · {job.dates} · {job.location}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink">{job.role}</h3>
                <p className="italic text-blue">
                  <Company job={job} />
                </p>
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

        <div className="relative">
          <Vias points={AFTER} />
        </div>
        <Reveal className="mt-14">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm lowercase text-ink underline decoration-pink decoration-2 underline-offset-4 hover:text-blue"
          >
            the full resume, if you like pdfs
            <Out />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
