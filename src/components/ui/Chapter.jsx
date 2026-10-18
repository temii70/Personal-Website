import Reveal from "./Reveal";

// The quiet lowercase caption + heading that opens each chapter.
export function Caption({ children, className = "" }) {
  return (
    <p className={`font-hand text-lg lowercase text-ink-soft ${className}`}>{children}</p>
  );
}

export function ChapterTitle({ caption, children, light = false }) {
  return (
    <Reveal className="mb-12">
      <Caption className={light ? "!text-night/70" : ""}>{caption}</Caption>
      <h2 className={`mt-1 font-hand text-4xl lowercase sm:text-5xl ${light ? "text-night" : "text-ink"}`}>{children}</h2>
    </Reveal>
  );
}
