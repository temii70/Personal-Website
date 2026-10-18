import { useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { IndexCard } from "./ui/Notebook";
import { profile } from "../data";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const Field = ({ label, as: Tag = "input", ...props }) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">{label}</span>
    <Tag
      {...props}
      required
      className="mt-1 block w-full resize-none border-0 border-b border-ink/30 bg-transparent px-0 py-1.5 font-hand text-lg text-pen outline-none transition-colors focus:border-signal"
    />
  </label>
);

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("https://portfolio-te9i.onrender.com/send-email", form);
      setStatus("sent");
      setForm(EMPTY);
    } catch (error) {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <Section id="Contact" page="06" label="contact" title="Say hi" paper="ruled">
      <div className="grid gap-14 md:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>Looking for ML, data or software roles, research collaborations, or just someone to argue about the Lakers with.</p>
          <p>
            Email{" "}
            <a href={`mailto:${profile.email}`} className="text-ink underline decoration-signal underline-offset-4 hover:text-signal">
              {profile.email}
            </a>
            , or fill in the card.
          </p>
          <div className="flex gap-5 pt-2 text-ink-soft">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink">
              <FaGithub size={22} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink">
              <FaLinkedin size={22} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <IndexCard rotate={0.6}>
            <form onSubmit={onSubmit} className="space-y-6 px-7 pb-8 pt-5 sm:px-9">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="name" name="name" value={form.name} onChange={onChange} />
                <Field label="email" name="email" type="email" value={form.email} onChange={onChange} />
              </div>
              <Field label="subject" name="subject" value={form.subject} onChange={onChange} />
              <Field label="message" as="textarea" name="message" rows={4} value={form.message} onChange={onChange} />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition hover:bg-signal disabled:opacity-60"
                >
                  {status === "sending" ? "sending…" : "send →"}
                </button>
                <p aria-live="polite" className="font-hand text-lg">
                  {status === "sent" && <span className="text-pen">got it, thank you! i'll write back soon.</span>}
                  {status === "error" && <span className="text-signal">that didn't go through. try email instead?</span>}
                </p>
              </div>
            </form>
          </IndexCard>
        </Reveal>
      </div>
    </Section>
  );
}
