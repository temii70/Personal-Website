import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { IndexCard } from "./ui/Notebook";
import Figure from "../art/Figure";
import { projects } from "../data";

const TILT = [-1, 0.8, -0.5, 1.2, -0.9];

function ProjectCard({ project, index }) {
  const card = (
    <IndexCard rotate={TILT[index % TILT.length]} className="h-full">
      <div className="flex h-full flex-col px-6 pb-6 pt-4 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className={`font-display leading-tight text-ink ${project.featured ? "text-2xl" : "text-xl"}`}>{project.name}</h3>
          <Figure kind={project.figure} seed={project.name} className={`shrink-0 ${project.featured ? "h-24 w-24" : "h-16 w-16"}`} />
        </div>
        <p className="mt-3 flex-1 leading-[32px] text-ink-soft">{project.description}</p>
        <div className="mt-4 flex items-end justify-between gap-4 font-mono text-[11px] uppercase tracking-wider">
          <span className="text-ink-soft">{project.tags.join(" / ")}</span>
          {project.link && <span className="shrink-0 text-signal group-hover:underline">open ↗</span>}
        </div>
      </div>
    </IndexCard>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {card}
    </a>
  ) : (
    card
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="Projects" page="04" label="projects" title="Things I've built" paper="graph">
      <div className="grid gap-12 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>
      <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <ProjectCard project={p} index={i + featured.length} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
