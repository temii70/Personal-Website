import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { Photo } from "./ui/Notebook";
import { interests } from "../data";

const TILT = [-2, 1.5, -1];

export default function Interests() {
  return (
    <Section id="Interests" page="05" label="off the clock" title="Outside the lab" paper="dots">
      <div className="grid gap-14 sm:grid-cols-3 sm:gap-8">
        {interests.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1} className={i === 1 ? "sm:mt-10" : ""}>
            <Photo src={item.image} alt={item.title} caption={`fig. 5${"abc"[i]} — ${item.title}`} rotate={TILT[i]} imgClassName="aspect-square" />
            <p className="mt-4 leading-relaxed text-ink-soft">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
