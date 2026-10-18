import { useEffect, useMemo, useRef, useState } from "react";
import { useKernel } from "./Kernel";
import { palette } from "../theme";

// The execution trace: a hand-wobbly orange line down the gutter that grows to connect
// every cell you've run so far.

function wobble(height) {
  let d = "M5,0";
  for (let y = 12; y <= height; y += 12) {
    const x = 5 + 1.6 * Math.sin(y / 90) + 0.8 * Math.sin(y / 37);
    d += ` L${x.toFixed(2)},${y}`;
  }
  return d;
}

export default function Trace() {
  const { count, executed } = useKernel();
  const ref = useRef(null);
  const [reach, setReach] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const root = ref.current.parentElement;
    const measure = () => {
      const top = root.getBoundingClientRect().top;
      const ys = executed.current.map((el) => el.getBoundingClientRect().top - top + 22);
      setReach(ys.length ? Math.max(...ys) : 0);
      setTotal(root.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [count, executed]);

  const d = useMemo(() => wobble(total), [total]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-[38px] top-0 hidden -translate-x-1/2 overflow-hidden transition-[height] duration-700 ease-out md:block"
      style={{ height: reach }}
    >
      <svg width="10" height={total}>
        <path d={d} fill="none" stroke={palette.orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
