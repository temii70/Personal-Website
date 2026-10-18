import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell, H2 } from "../notebook/Cell";
import { Snapshot } from "../notebook/outputs";
import { interests } from "../data";

const TILT = [-2, 1.5, -1];

export default function Interests() {
  return (
    <section id="Interests" className="scroll-mt-20 space-y-10 pt-28">
      <MarkdownCell>
        <Reveal>
          <H2>Off the clock</H2>
        </Reveal>
      </MarkdownCell>

      <CodeCell
        code={`for hobby in [${interests.map((i) => `"${i.title}"`).join(", ")}]:
    display(hobby)`}
      >
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {interests.map((item, i) => (
            <figure key={item.title} className={i === 1 ? "sm:mt-8" : ""}>
              <Snapshot src={item.image} alt={item.title} rotate={TILT[i]} imgClassName="aspect-square" />
              <figcaption className="mt-5">
                <p className="font-display text-xl italic text-ink">{item.title}</p>
                <p className="mt-1 leading-relaxed text-ink-soft">{item.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </CodeCell>
    </section>
  );
}
