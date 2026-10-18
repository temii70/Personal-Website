import Murmuration from "../art/Murmuration";
import { CodeCell } from "../notebook/Cell";

// A live flock of birds as a cell output: a nod to ensemble models.
export default function Interlude() {
  return (
    <section className="pt-28" aria-label="Animated flock of birds">
      <CodeCell
        code={`ensemble = Flock(n_models=380)
ensemble.fly()`}
      >
        <div className="relative overflow-hidden rounded-md border border-line bg-[#fbf8f1]">
          <Murmuration className="block h-[380px] w-full touch-pan-y sm:h-[440px]" />
          <div className="pointer-events-none absolute right-5 top-6 max-w-[16rem] text-right sm:right-8">
            <p className="font-display text-2xl italic leading-tight text-ink">many small models, one decision</p>
            <p className="mt-2 font-hand text-base text-pen">(try moving through them)</p>
          </div>
        </div>
      </CodeCell>
    </section>
  );
}
