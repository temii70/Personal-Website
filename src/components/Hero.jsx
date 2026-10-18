import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Garden from "../art/Garden";
import Reveal from "./ui/Reveal";
import { Polaroid, StitchBorder } from "./ui/Paper";
import { profile } from "../data";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(100svh,900px)] flex-col overflow-hidden bg-paper">
      <StitchBorder side="left" />
      <StitchBorder side="right" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-56 pt-32 sm:px-12 md:grid-cols-[1fr_auto] md:pb-64">
        <Reveal>
          <p className="font-hand text-2xl text-ink-soft">hi, i'm</p>
          <h1 className="mt-1 font-serif text-6xl tracking-tight text-ink sm:text-7xl">{profile.name}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            I'm a computing science student who builds machine learning systems: catching fraud at RBC, forecasting the weather
            months ahead, and listening for early signs of dementia in speech. Mostly, I like finding the pattern hiding in the
            noise.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 font-hand text-xl">
            <a href="#Projects" className="sketch bg-ink px-5 py-1.5 text-paper transition hover:bg-rust">
              see what i've made
            </a>
            <a href="#Contact" className="sketch px-5 py-1.5 text-ink transition hover:bg-ink hover:text-paper">
              say hi
            </a>
            <span className="flex items-center gap-4 pl-1 text-ink-soft">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink">
                <FaGithub size={20} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink">
                <FaLinkedin size={20} />
              </a>
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto w-52 sm:w-60">
          <Polaroid src="/headshot2.webp" alt="Temi Otun" caption="me, mid-thought" rotate={3} />
        </Reveal>
      </div>

      <Garden className="absolute inset-x-0 bottom-0 h-56 w-full md:h-72" />
    </section>
  );
}
