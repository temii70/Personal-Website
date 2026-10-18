import Reveal from "./Reveal";

// The quiet lowercase caption + heading that opens each chapter.
export function Caption({ children, className = "" }) {
  return (
    <p className={`font-mono text-sm lowercase text-ink-soft ${className}`}>
      <span className="mr-2 text-pink">+</span>
      {children}
    </p>
  );
}

export function ChapterTitle({ caption, children, light = false }) {
  return (
    <Reveal className="mb-12">
      <Caption className={light ? "!text-night/70" : ""}>{caption}</Caption>
      <h2 className={`mt-3 font-display text-5xl sm:text-6xl ${light ? "text-night" : "text-ink"}`}>{children}</h2>
    </Reveal>
  );
}
