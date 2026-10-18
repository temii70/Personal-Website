import { palette } from "../theme";

// Phyllotaxis: seed n sits at angle n × 137.5° (the golden angle) and radius √n.
// Every 13th and 21st seed is colored, both Fibonacci numbers.

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const SEEDS = Array.from({ length: 280 }, (_, i) => {
  const r = 3.1 * Math.sqrt(i);
  const a = i * GOLDEN_ANGLE;
  return {
    x: +(Math.cos(a) * r).toFixed(2),
    y: +(Math.sin(a) * r).toFixed(2),
    r: 0.55 + (i / 280) * 1.1,
    color: i % 21 === 0 ? palette.thread : i % 13 === 0 ? palette.rust : palette.ink,
  };
});

export default function Sunflower({ className = "" }) {
  return (
    <svg viewBox="-56 -56 112 112" className={className} aria-hidden>
      <g className="origin-center animate-[spin_120s_linear_infinite] motion-reduce:animate-none">
        {SEEDS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.color} opacity={s.color === palette.ink ? 0.75 : 1} />
        ))}
      </g>
    </svg>
  );
}
