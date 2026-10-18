import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { PaperNote } from "./ui/Paper";
import Doodle from "../art/Doodle";
import { projects } from "../data";

const TILT = [-1.4, 1.1, -0.6, 1.6, -1.2];

function ProjectNote({ project, index }) {
  const body = (
    <PaperNote seed={project.name} rotate={TILT[index % TILT.length]} className="h-full" innerClassName="flex h-full flex-col p-6 sm:p-7">
      <Doodle kind={project.doodle} seed={project.name} className={project.featured ? "h-24 w-24" : "h-16 w-16"} />
      <h3 className={`mt-4 font-serif text-ink ${project.featured ? "text-2xl" : "text-xl"}`}>{project.name}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{project.description}</p>
      <div className="mt-5 flex items-end justify-between gap-4 font-hand text-lg">
        <span className="text-moss">{project.tags.map((t) => `#${t.replace(/ /g, "")}`).join("  ")}</span>
        {project.link && <span className="shrink-0 text-rust group-hover:underline">have a look ↗</span>}
      </div>
    </PaperNote>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {body}
    </a>
  ) : (
    body
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="Projects" title="things i've made" aside="pinned up so i don't lose them" bg="sage" torn={false} className="pt-8 sm:pt-12">
      <div className="grid gap-10 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <ProjectNote project={p} index={i} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <ProjectNote project={p} index={i + featured.length} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
