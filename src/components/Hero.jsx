import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Signal from "../art/Signal";
import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell } from "../notebook/Cell";
import { profile } from "../data";

export default function Hero() {
  return (
    <section id="top" className="pt-28 sm:pt-36">
      <MarkdownCell>
        <Reveal>
          <p className="font-mono text-xs text-ink-soft">{profile.school}</p>
          <h1 className="mt-3 font-display text-6xl leading-[0.95] text-ink sm:text-8xl">
            <span className="mr-4 align-top font-mono text-2xl text-orange/70 sm:text-3xl">#</span>
            Temi Otun
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            I build machine learning systems: catching fraud at RBC, forecasting the weather months ahead, and listening for
            early signs of dementia in speech. Most of the job is finding the{" "}
            <mark className="marker text-ink">pattern hiding in the noise</mark>, so let's start there ↓
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[13px]">
            <a href="#Projects" className="rounded-sm bg-ink px-4 py-2 text-paper transition hover:bg-orange">
              ▶ see the work
            </a>
            <a href="#Contact" className="rounded-sm border border-ink px-4 py-2 text-ink transition hover:bg-ink hover:text-paper">
              say hi
            </a>
            <span className="flex items-center gap-4 pl-2 text-ink-soft">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink">
                <FaGithub size={20} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink">
                <FaLinkedin size={20} />
              </a>
            </span>
          </div>
        </Reveal>
      </MarkdownCell>

      <CodeCell
        className="mt-12"
        code={`noise = np.random.randn(1_000)
signal = temi.denoise(noise)  # most of the job, honestly
plt.plot(signal)`}
      >
        <Signal className="block h-52 w-full touch-pan-y sm:h-60" />
        <p className="mt-1 font-hand text-sm text-pen">↑ move your cursor through it to add the noise back</p>
      </CodeCell>
    </section>
  );
}
