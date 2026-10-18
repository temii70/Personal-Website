import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell, H2 } from "../notebook/Cell";
import Code from "../notebook/Code";
import { DataFrame, Snapshot } from "../notebook/outputs";
import LearningCurve from "../art/LearningCurve";
import { highlights, skills } from "../data";

// skills printed the way Python would print the dict
const toolbox = `{${Object.entries(skills)
  .map(([group, items], i) => `${i ? " " : ""}'${group}': [${items.map((s) => `'${s}'`).join(", ")}]`)
  .join(",\n")}}`;

export default function About() {
  return (
    <section id="About" className="scroll-mt-20 space-y-10 pt-28">
      <MarkdownCell>
        <Reveal>
          <H2>About me</H2>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              I study Computing Science at the University of Alberta, specializing in AI with a minor in Business. I'm a{" "}
              <mark className="marker text-ink">Jason Lang Scholarship</mark> recipient and on the Dean's List.
            </p>
            <p>
              Most of my work sits where research meets the real world: forecasting, healthcare prediction, language pipelines,
              and lately local LLM agents. I like problems where a better model turns into a number someone actually cares about.
            </p>
            <p>Otherwise you'll find me at the gym, on a basketball court, deep in a manga, or planning the next trip.</p>
          </div>
        </Reveal>
      </MarkdownCell>

      <CodeCell code={`display(Image("temi.jpg"))  # me, mid-thought`}>
        <Snapshot src="/headshot2.webp" alt="Temi Otun" rotate={1.5} className="w-56 sm:w-64" />
      </CodeCell>

      <CodeCell code={`pd.DataFrame(temi.highlights)`}>
        <DataFrame columns={["result", "context"]} rows={highlights.map((h) => [h.value, h.label])} />
      </CodeCell>

      <CodeCell code={`temi.toolbox`}>
        <Code code={toolbox} variant="output" />
      </CodeCell>

      <CodeCell
        code={`with plt.xkcd():  # keeping it honest
    plt.plot(temi.loss_history)`}
      >
        <LearningCurve className="w-full max-w-lg" />
      </CodeCell>
    </section>
  );
}
