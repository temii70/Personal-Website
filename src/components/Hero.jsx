import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Reveal from "./ui/Reveal";
import { Caption } from "./ui/Chapter";
import { profile } from "../data";

// Chapter 1 · noise. The signal line starts at the top edge here, still pure static.
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(88svh,820px)] items-center">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 pt-32 sm:px-10">
        <Reveal>
          <Caption>everything starts as noise</Caption>
          <h1 className="mt-5 font-display text-7xl leading-[0.9] text-ink sm:text-9xl">
            Temi <span className="italic text-blue">Otun</span>
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
    </section>
  );
}
