import Murmuration from "../art/Murmuration";
import { TornEdge } from "./ui/Paper";
import { palette } from "../theme";

// A breather between sections: a live flock of birds, a nod to ensemble models.
export default function Interlude() {
  return (
    <section className="relative bg-sage" aria-label="Animated flock of birds">
      <TornEdge color={palette.sage} seed="flock" />
      <Murmuration className="block h-[420px] w-full touch-pan-y sm:h-[480px]" />
      <div className="pointer-events-none absolute right-6 top-10 z-10 max-w-xs text-right font-hand sm:right-14">
        <p className="text-2xl text-ink">many small models, one decision</p>
        <p className="mt-1 text-base text-ink-soft">(ensembles, but make it birds. try moving through them.)</p>
      </div>
    </section>
  );
}
