import Murmuration from "../art/Murmuration";

// A breather between sections: a live flock of birds, a nod to ensemble models.
export default function Interlude() {
  return (
    <section className="paper-dots relative border-t border-ink/10" aria-label="Animated flock of birds">
      <Murmuration className="block h-[420px] w-full touch-pan-y sm:h-[480px]" />
      <div className="pointer-events-none absolute right-6 top-10 z-10 max-w-xs text-right sm:right-14">
        <p className="font-display text-2xl italic text-ink">many small models, one decision</p>
        <p className="mt-2 font-hand text-base text-pen">(try moving through them)</p>
      </div>
    </section>
  );
}
