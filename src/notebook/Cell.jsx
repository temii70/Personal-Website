import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useKernel } from "./Kernel";
import Code from "./Code";

const GRID = "relative grid gap-x-5 gap-y-1 md:grid-cols-[5.5rem_minmax(0,1fr)]";

function Prompt({ kind, label, className = "", style }) {
  return (
    <div style={style} className={`select-none whitespace-pre font-mono text-xs md:pt-[13px] md:text-right ${kind === "in" ? "text-pen" : "text-signal"} ${className}`}>
      {kind === "in" ? "In" : "Out"} [{label}]:
    </div>
  );
}

// A code cell that "executes" when it scrolls into view: In [ ] → In [*] → In [n], then its
// output fades in. Outputs are always mounted so the page never jumps when a cell runs.
export function CodeCell({ code, children, className = "" }) {
  const { run, begin, end } = useKernel();
  const still = useReducedMotion();
  const promptRef = useRef(null);
  const [n, setN] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = promptRef.current;
    let timer;
    let started = false;

    const finish = () => {
      setN(run(el));
      setRunning(false);
      if (started) end();
      started = false;
    };

    // reduced motion: no theatre, every cell has simply already run (effects fire in page order)
    if (still) {
      finish();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // run once on screen, or straight away if we've already scrolled past it
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        observer.disconnect();
        started = true;
        begin();
        setRunning(true);
        // cells higher on the page finish first, so counts read top to bottom
        // (including cells above the screen, e.g. after jumping to #Contact)
        const depth = Math.max(0, entry.boundingClientRect.top + 3 * window.innerHeight) / window.innerHeight;
        timer = setTimeout(finish, 250 + depth * 250 + Math.random() * 80);
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      if (started) end();
    };
  }, [run, begin, end, still]);

  const done = n !== null;
  // inline so the fade never waits on Tailwind's CDN generating a class
  const show = {
    opacity: done ? 1 : 0,
    transform: done ? "none" : "translateY(8px)",
    transition: still ? "none" : "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <div className={`${GRID} ${className}`}>
      <span
        aria-hidden
        className={`absolute left-[6px] top-[18px] hidden h-2 w-2 -translate-x-1/2 rounded-full transition-colors duration-500 md:block ${
          done ? "bg-orange" : "bg-line"
        }`}
      />
      <div ref={promptRef}>
        <Prompt kind="in" label={running ? "*" : n ?? " "} />
      </div>
      <Code code={code} />
      {children && (
        <>
          <Prompt kind="out" label={n ?? " "} className="mt-2 md:mt-0 md:pt-5" style={show} />
          <div className="min-w-0 pb-2 pt-4" style={show}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

// Rendered markdown: no prompt, just the content in the cell column.
export function MarkdownCell({ id, className = "", children }) {
  return (
    <div id={id} className={`${GRID} scroll-mt-24 ${className}`}>
      <div aria-hidden className="hidden md:block" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function H2({ children }) {
  return (
    <h2 className="font-display text-4xl text-ink sm:text-5xl">
      <span className="mr-3 align-middle font-mono text-xl text-orange/70">##</span>
      {children}
    </h2>
  );
}
