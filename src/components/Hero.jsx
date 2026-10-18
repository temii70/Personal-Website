import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Reveal from "./ui/Reveal";
import { Caption } from "./ui/Chapter";
import RandomForest from "../art/RandomForest";
import { Anchor } from "../art/SignalLine";
import { profile } from "../data";

const FLOURISH = [
  [74, 13],
  [52, 24],
  [66, 40],
  [82, 45],
  [91, 36],
  [82, 27],
  [74, 36],
  [83, 47],
  [88, 60],
  [62, 74],
  [34, 84],
  [50, 96],
  [86, 104],
  [100, 112],
];

// Chapter 1 · noise. The signal line flourishes in from the top right, loops, and crosses the forest to the voice.
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(88svh,820px)] items-center">
      {/* the signal line's flourish: in from the right edge, over the top of the name, a loop
          in the open space, back and forth across the forest, then down into the voice in About.
          x is a share of the text column, y a share of the hero's height. */}
      <Anchor kind="origin" dir="left" x="100%" y="7%" />
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-5xl px-6 sm:px-10">
        <div className="relative h-full">
          {FLOURISH.map(([x, y]) => (
            <Anchor key={`${x}-${y}`} kind="via" x={`${x}%`} y={`${y}%`} />
          ))}
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-56 pt-32 sm:px-10 sm:pb-64">
        <Reveal>
          <Caption>everything starts as noise</Caption>
          <h1 className="name mt-5 font-name text-7xl font-light leading-[0.9] text-ink sm:text-9xl">
            Temi Otun
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft">
            I'm a computing science student at the University of Alberta. I build machine learning systems that catch fraud,
            forecast the weather and listen for early signs of dementia in speech. Mostly I like finding the{" "}
            <mark className="marker text-ink">pattern hiding in the noise</mark>.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-sm lowercase">
            <a href="#Projects" className="bg-ink px-5 py-2.5 text-paper transition hover:bg-pink">
              see what i've made →
            </a>
            <a href="#Contact" className="text-ink underline decoration-pink decoration-2 underline-offset-4 hover:text-blue">
              say hi
            </a>
            <span className="flex items-center gap-4 text-ink-soft">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-blue">
                <FaGithub size={20} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue">
                <FaLinkedin size={20} />
              </a>
            </span>
          </div>
        </Reveal>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-56">
        <RandomForest className="absolute inset-0 h-full w-full" />
        <p className="absolute bottom-3 right-6 font-hand text-base lowercase text-ink-soft sm:right-10">a random forest, voting</p>
      </div>
    </section>
  );
}
