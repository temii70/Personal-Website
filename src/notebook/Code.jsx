import { palette } from "../theme";

// A tiny Python highlighter: comments, strings, numbers, keywords, calls, and a few names.
const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d[\d_]*(?:\.\d+)?\b)|(\b(?:for|in|with|as|import|from|def|return|if|else|True|False|None|and|or|not)\b)|(\b[A-Za-z_]\w*(?=\())|(\b(?:temi|np|pd|plt)\b)/g;
const COLORS = [palette.comment, palette.string, palette.number, palette.keyword, palette.func, palette.object];

function highlight(line) {
  const parts = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    const kind = m.slice(1).findIndex(Boolean);
    parts.push(
      <span key={m.index} style={{ color: COLORS[kind], fontStyle: kind === 0 ? "italic" : undefined }}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

// variant "input" is a code cell; "output" is printed text (no box, wraps long lines)
export default function Code({ code, variant = "input", className = "" }) {
  const lines = code.replace(/^\n/, "").replace(/\n\s*$/, "").split("\n");
  const box =
    variant === "input"
      ? "overflow-x-auto rounded-md border border-line bg-cell px-4 py-3"
      : "whitespace-pre-wrap break-words";

  return (
    <pre className={`font-mono text-[13px] leading-6 text-ink ${box} ${className}`}>
      <code>
        {lines.map((line, i) => (
          <div key={i}>{line ? highlight(line) : " "}</div>
        ))}
      </code>
    </pre>
  );
}
