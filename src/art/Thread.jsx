import { useEffect, useMemo, useRef, useState } from "react";
import { rng, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// A gold thread that meanders down the whole page and draws itself as you scroll.

function buildPath(w, h) {
  if (!w || !h) return "";
  const rand = rng("thread");
  const pts = [];
  const step = 560;
  for (let y = 0, i = 0; y < h + step; y += step, i++) {
    const x = i % 2 ? 0.12 + rand() * 0.25 : 0.62 + rand() * 0.28;
    pts.push([w * x, Math.min(y, h)]);
  }

  // Catmull-Rom through the points, written out as cubic beziers
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map((v) => v.toFixed(1))} ${c2.map((v) => v.toFixed(1))} ${p2.map((v) => v.toFixed(1))}`;
  }
  return d;
}

export default function Thread() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const parent = svgRef.current.parentElement;
    const measure = () => setSize({ w: parent.offsetWidth, h: parent.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  const d = useMemo(() => buildPath(size.w, size.h), [size]);

  useEffect(() => {
    const onScroll = () => {
      if (!pathRef.current) return;
      if (prefersReducedMotion()) {
        pathRef.current.style.strokeDashoffset = "0";
        return;
      }
      const lead = window.innerHeight * 0.65;
      const max = document.documentElement.scrollHeight - window.innerHeight + lead;
      const progress = Math.min(1, (window.scrollY + lead) / max);
      pathRef.current.style.strokeDashoffset = String(1 - progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [d]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute left-0 top-0 z-[5]"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
      aria-hidden
    >
      <path ref={pathRef} d={d} fill="none" stroke={palette.thread} strokeWidth="1.3" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
  );
}
