import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Signal from "../art/Signal";
import Reveal from "./ui/Reveal";
import { profile } from "../data";

export default function Hero() {
  return (
    <section id="top" className="paper-graph relative overflow-hidden">
      {/* margin note pointing at the chart-recorder pen, which sits at 50vh */}
      <p className="absolute left-12 top-[50vh] z-10 hidden w-28 -translate-y-1/2 font-hand text-xs leading-snug text-pen xl:block">
        ← this pen is recording how you scroll
      </p>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-36 sm:px-12 sm:pt-44">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">p.01 — {profile.school}</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] text-ink sm:text-8xl">
            Temi <span className="italic">Otun</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            I build machine learning systems: catching fraud at RBC, forecasting the weather months ahead, and listening for
            early signs of dementia in speech. Most of the job is finding the{" "}
            <mark className="marker text-ink">pattern hiding in the noise</mark>.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.15em]">
            <a href="#Projects" className="bg-ink px-5 py-3 text-paper transition hover:bg-signal">
              see the work →
            </a>
            <a href="#Contact" className="border border-ink px-5 py-3 text-ink transition hover:bg-ink hover:text-paper">
              get in touch
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
      </div>

      <div className="relative z-10 mt-10">
        <Signal className="block h-56 w-full touch-pan-y sm:h-64" />
        <p className="mx-auto max-w-5xl px-6 pb-10 pt-2 font-mono text-[11px] text-ink-soft sm:px-12">
          fig. 0 — noise → signal, the whole job in one picture. move through it to add the noise back.
        </p>
      </div>
    </section>
  );
}
