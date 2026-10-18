import Murmuration from "../art/Murmuration";
import { Anchor } from "../art/SignalLine";

// Chapter 4 · flock. The line flies into the flock and out the other side.
export default function Interlude() {
  return (
    <section className="relative py-16" aria-label="Animated flock of birds">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <div className="relative">
          <Anchor kind="end" dir="left" x="100%" y="36%" />
          <Anchor kind="start" dir="left" x="0%" y="92%" />
          <Murmuration className="block h-[420px] w-full touch-pan-y sm:h-[480px]" />
          <div className="pointer-events-none absolute right-0 top-4 max-w-[17rem] text-right">
            <p className="font-display text-3xl italic leading-tight text-ink">many small models, one decision</p>
            <p className="mt-2 font-mono text-sm lowercase text-pink">(try moving through them)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
