import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell, H2 } from "../notebook/Cell";
import Figure from "../art/Figure";
import { projects } from "../data";

function ProjectCard({ project }) {
  const card = (
    <article className="flex h-full flex-col rounded-md border border-line bg-[#fbf8f1] p-5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(43,38,32,0.10)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className={`font-display leading-tight text-ink ${project.featured ? "text-2xl" : "text-xl"}`}>{project.name}</h3>
        <Figure kind={project.figure} seed={project.name} className={`shrink-0 ${project.featured ? "h-24 w-24" : "h-16 w-16"}`} />
      </div>
      <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{project.description}</p>
      <div className="mt-5 flex items-end justify-between gap-4 font-mono text-xs">
        <span className="text-ink-soft">[{project.tags.map((t) => `'${t}'`).join(", ")}]</span>
        {project.link && <span className="shrink-0 text-orange group-hover:underline">open ↗</span>}
      </div>
    </article>
  );

  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className="group block h-full">
      {card}
    </a>
  ) : (
    <div className="group h-full">{card}</div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="Projects" className="scroll-mt-20 space-y-10 pt-28">
      <MarkdownCell>
        <Reveal>
          <H2>Projects</H2>
          <p className="mt-3 text-lg text-ink-soft">Things I've built, each with a little sketch of the idea behind it.</p>
        </Reveal>
      </MarkdownCell>

      <CodeCell code={`temi.projects.show(sort_by="favourite")`}>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </CodeCell>
    </section>
  );
}
