import Reveal from "./Reveal";
import { TornEdge } from "./Paper";
import { palette } from "../../theme";

const BG = { paper: "bg-paper", blush: "bg-blush", sage: "bg-sage" };

// A sheet of paper: colored background, optional torn top edge, handwritten title.
export default function Section({ id, title, aside, bg = "paper", torn = true, className = "", children }) {
  return (
    <section id={id} className={`relative scroll-mt-16 py-24 sm:py-32 ${BG[bg]} ${className}`}>
      {torn && <TornEdge color={palette[bg]} seed={id || title} />}
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-12">
        {title && (
          <Reveal className="mb-14">
            <h2 className="font-hand text-4xl text-ink sm:text-5xl">{title}</h2>
            {aside && <p className="mt-1 font-hand text-lg text-ink-soft">{aside}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
