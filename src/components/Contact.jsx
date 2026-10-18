import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import { Anchor } from "../art/SignalLine";
import { palette } from "../theme";
import { profile } from "../data";

const EMPTY = { name: "", email: "", subject: "", message: "" };

// Chapter 7 · say hi. The signal comes in from the right and settles into a flat line, which beats once when it first
// comes into view and again whenever a message is sent.
function heartbeat(p) {
  const g = (mu, s, a) => a * Math.exp(-((p - mu) ** 2) / (2 * s * s));
  return g(0.18, 0.025, 0.12) - g(0.36, 0.008, 0.12) + g(0.4, 0.01, 1) - g(0.44, 0.01, 0.25) + g(0.66, 0.045, 0.28);
}
const linePath = (beat) => {
  let d = "";
  for (let x = 0; x <= 1000; x += 8) {
    const p = (x - 420) / 200;
    const y = beat && p >= 0 && p <= 1 ? 60 - 52 * heartbeat(p) : 60;
    d += `${x ? "L" : "M"}${x},${y.toFixed(1)}`;
  }
  return d;
};
const FLAT = linePath(false);
const BEAT = linePath(true);

function Flatline({ beat }) {
  return (
    <div className="relative">
      <Anchor kind="end" dir="left" x="100%" y="50%" />
      <svg aria-hidden className="block h-28 w-full overflow-visible" viewBox="0 0 1000 120" preserveAspectRatio="none">
        <motion.path d={FLAT} animate={{ d: beat ? BEAT : FLAT }} transition={{ duration: 0.25 }} transform="translate(0 2)" fill="none" stroke={palette.pink} strokeOpacity="0.55" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <motion.path d={FLAT} animate={{ d: beat ? BEAT : FLAT }} transition={{ duration: 0.25 }} fill="none" stroke={palette.blue} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* where the signal ends */}
      <span aria-hidden className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink" />
    </div>
  );
}

const Field = ({ label, as: Tag = "input", ...props }) => (
  <label className="block">
    <span className="font-mono text-xs lowercase text-ink-soft">{label}</span>
    <Tag
      {...props}
      required
      className="mt-1 block w-full resize-none border-0 border-b-2 border-ink/15 bg-transparent px-0 py-2 text-lg text-ink outline-none transition-colors focus:border-blue"
    />
  </label>
);

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [beat, setBeat] = useState(false);
  const lineRef = useRef(null);

  const pulse = () => {
    setBeat(true);
    setTimeout(() => setBeat(false), 450);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      setTimeout(pulse, 400);
    }, { threshold: 0.6 });
    observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("https://portfolio-te9i.onrender.com/send-email", form);
      setStatus("sent");
      setForm(EMPTY);
      pulse();
    } catch (error) {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <section id="Contact" className="relative scroll-mt-16 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="send a signal">Say hi</ChapterTitle>

        <div ref={lineRef}>
          <Flatline beat={beat} />
        </div>

        <div className="mt-14 grid gap-14 md:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>Looking for ML, data or software roles, research collaborations, or just someone to argue about the Lakers with.</p>
            <p>
              Email{" "}
              <a href={`mailto:${profile.email}`} className="text-ink underline decoration-pink decoration-2 underline-offset-4 hover:text-blue">
                {profile.email}
              </a>
              , or leave a note here.
            </p>
            <div className="flex gap-5 pt-1">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-blue">
                <FaGithub size={22} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue">
                <FaLinkedin size={22} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="name" name="name" value={form.name} onChange={onChange} />
                <Field label="email" name="email" type="email" value={form.email} onChange={onChange} />
              </div>
              <Field label="subject" name="subject" value={form.subject} onChange={onChange} />
              <Field label="message" as="textarea" name="message" rows={4} value={form.message} onChange={onChange} />
              <div className="flex flex-wrap items-center gap-5 pt-2 font-mono text-sm lowercase">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-blue px-6 py-3 text-paper shadow-[3px_3px_0_#ff5fa2] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#ff5fa2] disabled:opacity-60"
                >
                  {status === "sending" ? "sending…" : "send it →"}
                </button>
                <p aria-live="polite">
                  {status === "sent" && <span className="text-blue">got it. i'll write back soon.</span>}
                  {status === "error" && <span className="text-pink">that didn't go through. try email instead?</span>}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
