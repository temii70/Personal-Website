import useCanvas from "./useCanvas";
import { rng, prefersReducedMotion } from "./random";
import { palette } from "../theme";

// Voice → words. Hundreds of dots start as pure noise and are denoised step by step until
// they settle into a speech waveform, one burst per word with silence between. Then a
// playhead listens along it and writes the transcript underneath, word by word. Moving
// through the dots adds noise back, and the words under that bit stop making sense.

const LONG = "hi, i'm temi. i listen for the pattern in the noise".split(" ");
const SHORT = "hi, i'm temi. i listen".split(" ");
const DENOISE_MS = 2600;
const LISTEN_PX_PER_MS = 0.22;
const SPACING = 2.5;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const SCRAMBLE = "abcdefghijklmnopqrstuvwxyz";

// lay the words out along the width: a burst a little wider than each word, silence between
function layout(words, width) {
  const margin = width * 0.04;
  const gap = 1.4;
  const units = words.reduce((s, w) => s + w.length + gap, -gap);
  const unit = (width - margin * 2) / units;
  let x = margin;
  return words.map((text) => {
    const span = { text, x0: x, x1: x + text.length * unit };
    x = span.x1 + gap * unit;
    return span;
  });
}

function drawVoice(ctx, width, height, canvas) {
  const rand = rng("voice");
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());

  const words = layout(width < 560 ? SHORT : LONG, width);
  const mid = height * 0.42; // the page line meets the waveform here, at both ends
  const amp = height * 0.3;
  const n = Math.round(width / SPACING);

  // the loudness envelope: a few syllable bumps inside each word, flat silence elsewhere
  const envelope = (x) => {
    const w = words.find((s) => x >= s.x0 && x <= s.x1);
    if (!w) return 0;
    const u = (x - w.x0) / (w.x1 - w.x0);
    const syllables = Math.max(1, Math.round(w.text.length / 2.6));
    return Math.sin(Math.PI * u) ** 0.7 * (0.45 + 0.55 * Math.abs(Math.sin(Math.PI * u * syllables)));
  };

  const dots = Array.from({ length: n }, (_, i) => {
    const tx = ((i + 0.5) / n) * width;
    // alternate above and below the baseline with a random height, like a sampled waveform
    const ty = mid - amp * envelope(tx) * (0.35 + 0.65 * rand()) * (i % 2 ? 1 : -1);
    return { tx, ty, ex: gauss(), ey: gauss(), local: 0, s: 1, x: 0, y: 0 };
  });
  for (const w of words) {
    w.dots = dots.filter((d) => d.tx >= w.x0 && d.tx <= w.x1);
    w.heard = 0;
  }

  const pointer = { x: -1e4, y: -1e4 };
  let start;
  let raf;
  let visible = false;

  const render = (elapsed, still = false) => {
    const scheduled = 1 - easeInOut(Math.min(1, elapsed / DENOISE_MS));
    const listened = still ? Infinity : (elapsed - DENOISE_MS) * LISTEN_PX_PER_MS;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = 0.6;
    for (const d of dots) {
      const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
      if (dist < 70) d.local = Math.max(d.local, 0.8 * (1 - dist / 70));
      d.local *= 0.965;
      d.ex += (gauss() - d.ex) * 0.02;
      d.ey += (gauss() - d.ey) * 0.02;
      d.s = Math.max(scheduled, d.local);
      d.x = d.tx + d.s * d.ex * 50;
      d.y = d.ty + d.s * d.ey * height * 0.3;
      ctx.fillRect(d.x - 0.7, d.y - 0.7, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    // ink the waveform wherever neighbouring dots have settled
    ctx.strokeStyle = palette.blue;
    ctx.lineWidth = 1.1;
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const a = dots[i - 1];
      const b = dots[i];
      if (a.s < 0.06 && b.s < 0.06) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
    ctx.stroke();

    // the transcript: each word is written once the playhead has heard all of it,
    // and garbles wherever the waveform above it has been disturbed
    ctx.font = `${Math.round(Math.min(26, Math.max(17, height * 0.1)))}px "Patrick Hand", cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const w of words) {
      if (listened >= w.x1) w.heard = Math.min(1, w.heard + (still ? 1 : 0.05));
      if (!w.heard) continue;
      const noise = w.dots.reduce((m, d) => Math.max(m, d.local), 0);
      const text = noise > 0.15 ? [...w.text].map((c) => (rand() < noise ? SCRAMBLE[Math.floor(rand() * 26)] : c)).join("") : w.text;
      ctx.globalAlpha = w.heard * (1 - noise * 0.6);
      ctx.fillStyle = palette.ink;
      ctx.fillText(text, (w.x0 + w.x1) / 2, height * 0.86 + (1 - w.heard) * 6);
    }
    ctx.globalAlpha = 1;

    // the playhead, listening its way along and then looping
    if (scheduled === 0 && !still) {
      const head = dots[Math.floor((listened / SPACING) % n)];
      if (head && head.s < 0.06) {
        ctx.fillStyle = palette.signal;
        ctx.beginPath();
        ctx.arc(head.tx, mid, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  if (prefersReducedMotion()) {
    render(DENOISE_MS, true);
    return;
  }

  const frame = (now) => {
    start ??= now;
    render(now - start);
    if (visible) raf = requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(frame);
  });
  observer.observe(canvas);

  const onMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onLeave = () => {
    pointer.x = pointer.y = -1e4;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
  };
}

export default function Voice({ className = "" }) {
  const ref = useCanvas(drawVoice);
  return <canvas ref={ref} className={className} aria-hidden />;
}
