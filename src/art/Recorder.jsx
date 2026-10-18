import { useEffect, useRef, useState } from "react";
import { rng, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// A chart recorder in the left margin. The pen stays fixed mid-screen and the page scrolls
// under it like recorder paper, so the trace is a record of how you read: calm when you
// linger, spiky when you fly past. Paper only gets inked once, like the real thing.

const STEP = 3; // px of page per sample

const baseX = () => (window.innerWidth < 768 ? 12 : 34);
const maxAmp = () => (window.innerWidth < 768 ? 8 : 26);

export default function Recorder() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const penRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const parent = svgRef.current.parentElement;
    const measure = () => setSize({ w: parent.offsetWidth, h: parent.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rand = rng("recorder");
    const samples = [];
    let filled = -1;
    let phase = 0;
    let energy = 0;
    let lastScroll = window.scrollY;
    let raf;

    const write = (upTo, amp) => {
      for (let i = filled + 1; i <= upTo; i++) {
        phase += 0.55 + rand() * 0.5;
        samples[i] = amp * (0.65 * Math.sin(phase) + 0.35 * (rand() * 2 - 1)) + (rand() - 0.5) * 1.2;
      }
      filled = Math.max(filled, upTo);
    };

    const draw = () => {
      const b = baseX();
      let d = `M${b},0`;
      for (let i = 0; i <= filled; i++) d += `L${(b + samples[i]).toFixed(1)},${i * STEP}`;
      pathRef.current.setAttribute("d", d);
    };

    const penBucket = () => Math.floor((window.scrollY + window.innerHeight / 2) / STEP);

    if (prefersReducedMotion()) {
      write(Math.ceil(document.documentElement.scrollHeight / STEP), 1.5);
      draw();
      penRef.current.style.transform = `translateX(${baseX()}px)`;
      return;
    }

    write(penBucket(), 1.5);
    draw();

    const frame = () => {
      const velocity = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      energy = Math.max(energy * 0.92, Math.min(maxAmp(), velocity * 0.8));

      const before = filled;
      write(penBucket(), 1.5 + energy);
      if (filled !== before) draw();

      const tip = (samples[penBucket()] ?? 0) + (Math.random() - 0.5) * 0.8;
      penRef.current.style.transform = `translateX(${(baseX() + tip).toFixed(1)}px)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const b = size.w < 768 ? 12 : 34;

  return (
    <>
      <svg ref={svgRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-[5]" width={size.w} height={size.h}>
        <line x1={b} y1="0" x2={b} y2={size.h} stroke={palette.inkSoft} strokeOpacity="0.18" strokeDasharray="2 6" />
        <path ref={pathRef} fill="none" stroke={palette.signal} strokeWidth="1" strokeLinejoin="round" />
      </svg>

      {/* the pen: a stylus arm coming in from the edge, with an ink tip */}
      <div aria-hidden className="pointer-events-none fixed left-0 top-1/2 z-40">
        <div ref={penRef}>
          <span className="absolute right-0 top-0 h-px w-16 bg-ink/50" />
          <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-signal" />
        </div>
      </div>
    </>
  );
}
