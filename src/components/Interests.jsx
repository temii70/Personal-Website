import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { Polaroid, StitchBorder } from "./ui/Paper";
import { interests } from "../data";

const TILT = [-3, 2, -1.5];

export default function Interests() {
  return (
    <Section id="Interests" title="what i love" aside="when i'm not training models" bg="blush">
      <StitchBorder side="left" />
      <StitchBorder side="right" />
      <div className="grid gap-14 sm:grid-cols-3 sm:gap-8">
        {interests.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1} className={i === 1 ? "sm:mt-12" : ""}>
            <Polaroid src={item.image} alt={item.title} caption={item.title} rotate={TILT[i]} imgClassName="aspect-square" />
            <p className="mt-6 px-2 leading-relaxed text-ink-soft">{item.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
