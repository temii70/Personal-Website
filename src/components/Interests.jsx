import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import { Anchor } from "../art/SignalLine";
import { rng } from "../art/random";
import { palette } from "../theme";
import { interests } from "../data";

// Chapter 6 · night court. The signal drops into a navy sky and becomes a shot: a dotted
// path down the left, an arc across into the hoop, then a drop out the bottom.

const IN_X = 0.06;
const HOOP_X = 0.9;

function NightArt({ w, h, arc }) {
  const stars = useMemo(() => {
    const rand = rng("stars");
    return Array.from({ length: 70 }, () => ({ x: rand(), y: rand(), s: 1.5 + rand() * 2.5, c: rand() < 0.2 ? palette.pink : rand() < 0.5 ? palette.yellow : palette.night }));
  }, []);
  if (!w || !arc) return null;

  const inX = w * IN_X;
  const hoopX = w * HOOP_X;
  const base = arc.top + arc.height * 0.9;
  const apex = arc.top + arc.height * 0.05;
  const hoopY = arc.top + arc.height * 0.55;
  const cy = (4 * apex - base - hoopY) / 2; // control point that puts the peak at `apex`
  const at = (t) => [(1 - t) ** 2 * inX + 2 * (1 - t) * t * ((inX + hoopX) / 2) + t * t * hoopX, (1 - t) ** 2 * base + 2 * (1 - t) * t * cy + t * t * hoopY];
  const trail = Array.from({ length: 16 }, (_, i) => at(i / 16));
  const [bx, by] = at(0.985);

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0" width={w} height={h}>
      {stars.map((s, i) => (
        <path key={i} d={`M${s.x * w - s.s},${s.y * h} h${2 * s.s} M${s.x * w},${s.y * h - s.s} v${2 * s.s}`} stroke={s.c} strokeOpacity="0.7" strokeWidth="1" />
      ))}
      <g fill="none" stroke={palette.yellow} strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 9">
        <path d={`M${inX},0 V${base}`} />
        <path d={`M${hoopX},${hoopY + 34} V${h}`} />
      </g>
      {trail.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5 + i * 0.22} fill={palette.yellow} fillOpacity={0.35 + i * 0.04} />
      ))}
      {/* hoop: backboard, rim, net */}
      <line x1={hoopX + 34} x2={hoopX + 34} y1={hoopY - 54} y2={hoopY + 12} stroke={palette.night} strokeWidth="2.5" />
      <path d={`M${hoopX - 24},${hoopY + 4} l6,28 h36 l6,-28 M${hoopX - 12},${hoopY + 4} l2,28 M${hoopX},${hoopY + 4} v28 M${hoopX + 12},${hoopY + 4} l-2,28`} stroke={palette.night} strokeOpacity="0.6" fill="none" />
      <ellipse cx={hoopX} cy={hoopY + 4} rx="26" ry="5" fill="none" stroke={palette.pink} strokeWidth="2.5" />
      {/* the ball, riso offset */}
      <circle cx={bx + 2} cy={by + 2} r="10" fill={palette.misprint} fillOpacity="0" />
      <circle cx={bx} cy={by} r="10" fill={palette.yellow} />
      <path d={`M${bx - 10},${by} h20 M${bx},${by - 10} v20`} stroke={palette.navy} strokeWidth="1" />
    </svg>
  );
}

export default function Interests() {
  const ref = useRef(null);
  const arcRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0, arc: null });

  useEffect(() => {
    const el = ref.current;
    // the arc's room, measured relative to the section (offsetTop would be relative to the inner column)
    const measure = () =>
      setSize({
        w: el.offsetWidth,
        h: el.offsetHeight,
        arc: { top: arcRef.current.getBoundingClientRect().top - el.getBoundingClientRect().top, height: arcRef.current.offsetHeight },
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="Interests" ref={ref} className="relative scroll-mt-16 overflow-hidden bg-navy py-24 sm:py-32">
      <Anchor kind="end" dir="down" x={`${IN_X * 100}%`} y="0%" />
      <Anchor kind="start" dir="down" x={`${HOOP_X * 100}%`} y="100%" />
      <NightArt {...size} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="night court" light>
          Off the clock
        </ChapterTitle>

        {/* room for the shot to fly through */}
        <div ref={arcRef} className="h-56 sm:h-64" />

        <div className="mt-10 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {interests.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} className={i === 1 ? "sm:mt-10" : ""}>
              <figure>
                <div className="rotate-[var(--r)] bg-night p-2 shadow-[3px_6px_16px_rgba(0,0,0,0.35)]" style={{ "--r": `${[-2, 1.5, -1][i]}deg` }}>
                  <img src={item.image} alt={item.title} className="aspect-square w-full object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-5">
                  <p className="font-display text-2xl italic text-yellow">{item.title}</p>
                  <p className="mt-1 leading-relaxed text-night/80">{item.text}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
