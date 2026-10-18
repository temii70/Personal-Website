// Small pieces of the lab-notebook look: highlighted text, photos held by corners,
// paper-clipped index cards.

// Renders text with ==highlighted== spans, like running a marker over key numbers.
export function Marked({ text }) {
  return text.split(/(==[^=]+==)/g).map((part, i) =>
    part.startsWith("==") ? (
      <mark key={i} className="marker text-ink">
        {part.slice(2, -2)}
      </mark>
    ) : (
      part
    )
  );
}

const Corner = ({ className }) => (
  <svg viewBox="0 0 20 20" className={`absolute h-5 w-5 ${className}`} aria-hidden>
    <path d="M0 0 H20 L0 20 Z" fill="#1d2230" opacity="0.85" />
  </svg>
);

// A photo mounted with black album corners, with a "fig." caption underneath.
export function Photo({ src, alt, caption, rotate = 0, className = "", imgClassName = "aspect-[4/5]" }) {
  return (
    <figure className={className}>
      <div className="relative rotate-[var(--r)] bg-white p-2 shadow-[2px_4px_12px_rgba(29,34,48,0.12)]" style={{ "--r": `${rotate}deg` }}>
        <img src={src} alt={alt} className={`w-full object-cover ${imgClassName}`} loading="lazy" />
        <Corner className="left-0 top-0" />
        <Corner className="right-0 top-0 rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />
        <Corner className="bottom-0 left-0 -rotate-90" />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-xs text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}

const Paperclip = () => (
  <svg viewBox="0 0 24 60" className="absolute -top-5 right-5 z-10 h-14 w-6" aria-hidden>
    <path
      d="M7 46 V12 a5 5 0 0 1 10 0 V50 a8 8 0 0 1 -16 0 V18"
      fill="none"
      stroke="#8a93a3"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// A ruled index card: red header rule, faint blue lines, paperclip on top.
export function IndexCard({ rotate = 0, clip = true, className = "", children }) {
  return (
    <div
      className={`relative rotate-[var(--r)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 ${className}`}
      style={{ "--r": `${rotate}deg` }}
    >
      {clip && <Paperclip />}
      <div className="index-card h-full shadow-[2px_5px_14px_rgba(29,34,48,0.10)]">{children}</div>
    </div>
  );
}
