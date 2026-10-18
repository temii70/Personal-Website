import { useMemo } from "react";
import { rng } from "../../art/random";
import { palette } from "../../theme";

// Irregular polygon used as a clip-path so notes look torn rather than cut.
function tornPolygon(seed) {
  const rand = rng(seed);
  const pts = [];
  const edge = (n, at) => {
    for (let i = 0; i < n; i++) pts.push(at(i / n, (rand() * 1.4).toFixed(2)));
  };
  edge(14, (t, j) => `${(t * 100).toFixed(1)}% ${j}%`);
  edge(10, (t, j) => `${100 - j}% ${(t * 100).toFixed(1)}%`);
  edge(14, (t, j) => `${(100 - t * 100).toFixed(1)}% ${100 - j}%`);
  edge(10, (t, j) => `${j}% ${(100 - t * 100).toFixed(1)}%`);
  return `polygon(${pts.join(",")})`;
}

const TAPE = ["bg-[#e8dcc0]/80", "bg-[#d9c7c0]/80", "bg-[#cfd8c3]/80"];

export function Tape({ className = "", tone = 0 }) {
  return <span aria-hidden className={`absolute z-10 h-6 w-20 shadow-[0_1px_1px_rgba(0,0,0,0.06)] ${TAPE[tone % TAPE.length]} ${className}`} />;
}

// A torn note with an offset shadow and a strip of tape. `rotate` is in degrees.
export function PaperNote({ seed = "note", rotate = 0, tape = true, className = "", innerClassName = "p-6", children }) {
  const clip = useMemo(() => tornPolygon(seed), [seed]);
  return (
    <div
      className={`relative rotate-[var(--r)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 ${className}`}
      style={{ "--r": `${rotate}deg` }}
    >
      <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-2 bg-ink/10" style={{ clipPath: clip }} />
      <div className={`relative h-full bg-note ${innerClassName}`} style={{ clipPath: clip }}>
        {children}
      </div>
      {tape && <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" tone={seed.length} />}
    </div>
  );
}

export function Polaroid({ src, alt, caption, rotate = 0, className = "", imgClassName = "aspect-[4/5]" }) {
  return (
    <figure
      className={`relative rotate-[var(--r)] bg-white p-3 pb-4 shadow-[3px_6px_14px_rgba(58,52,46,0.15)] transition-transform duration-300 hover:rotate-0 ${className}`}
      style={{ "--r": `${rotate}deg` }}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" tone={alt.length} />
      <img src={src} alt={alt} className={`w-full object-cover ${imgClassName}`} loading="lazy" />
      {caption && <figcaption className="mt-3 text-center font-hand text-lg text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}

// Ragged top edge so one section looks torn over the previous one.
export function TornEdge({ color, seed }) {
  const d = useMemo(() => {
    const rand = rng(seed);
    let p = `M0,14 L0,${(4 + rand() * 6).toFixed(1)}`;
    for (let x = 0; x <= 100; x += 1.2 + rand() * 2.4) p += ` L${x.toFixed(2)},${(rand() * 9).toFixed(1)}`;
    return `${p} L100,6 L100,14 Z`;
  }, [seed]);

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 -top-3 h-3.5 w-full" viewBox="0 0 100 14" preserveAspectRatio="none">
      <path d={d} fill={color} />
    </svg>
  );
}

// A strip of cross-stitches down the edge of a section, mostly grey with a few colored ones.
const STITCH = (() => {
  const rand = rng("stitch");
  const colors = ["#aaa59b", "#aaa59b", "#aaa59b", "#bdb8ae", palette.rust, palette.thread, palette.sky];
  const n = 24;
  const gap = 18;
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='${n * gap}'>`;
  for (let i = 0; i < n; i++) {
    const c = colors[Math.floor(rand() * colors.length)];
    const y = i * gap + 4;
    svg += `<path d='M3 ${y} l8 8 M11 ${y} l-8 8' stroke='${c}' stroke-width='1.2' stroke-linecap='round'/>`;
  }
  return `url("data:image/svg+xml,${encodeURIComponent(svg + "</svg>")}")`;
})();

export function StitchBorder({ side = "left" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-12 hidden w-3.5 md:block ${side === "left" ? "left-5" : "right-5"}`}
      style={{ backgroundImage: STITCH, backgroundRepeat: "repeat-y" }}
    />
  );
}
