// Things a cell can output: a pandas-style table, a displayed image, highlighted text.

export function DataFrame({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="font-mono text-[13px] text-ink">
        <thead>
          <tr className="border-b border-ink/40">
            <th />
            {columns.map((c) => (
              <th key={c} className="px-4 py-2 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors odd:bg-cell hover:bg-marker/50">
              <th className="px-3 py-2 text-right font-semibold">{i}</th>
              {row.map((v, j) => (
                <td key={j} className={`px-4 py-2 ${j === 0 ? "whitespace-nowrap font-semibold" : ""}`}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// An image as if from IPython.display, printed like a photo and set down slightly crooked.
export function Snapshot({ src, alt, rotate = 0, className = "", imgClassName = "aspect-[4/5]" }) {
  return (
    <div
      className={`rotate-[var(--r)] bg-white p-2 shadow-[2px_5px_16px_rgba(43,38,32,0.14)] transition-transform duration-300 hover:rotate-0 ${className}`}
      style={{ "--r": `${rotate}deg` }}
    >
      <img src={src} alt={alt} className={`w-full object-cover ${imgClassName}`} loading="lazy" />
    </div>
  );
}

// Renders text with ==highlighted== spans.
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
