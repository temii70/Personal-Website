import { useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import { PaperNote } from "./ui/Paper";
import { profile } from "../data";

const EMPTY = { name: "", email: "", subject: "", message: "" };

// Lined-paper field: handwritten label, ink underline.
const Field = ({ label, as: Tag = "input", ...props }) => (
  <label className="block">
    <span className="font-hand text-lg text-ink-soft">{label}</span>
    <Tag
      {...props}
      required
      className="mt-1 block w-full resize-none border-0 border-b border-ink/25 bg-transparent px-0 py-1.5 text-ink outline-none transition-colors focus:border-rust"
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
    <Section id="Contact" title="say hi" aside="leave a note, i read every one">
      <div className="grid gap-14 md:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>Looking for ML, data or software roles, research collaborations, or just someone to argue about the Lakers with.</p>
          <p>
            Email me at{" "}
            <a href={`mailto:${profile.email}`} className="text-ink underline decoration-thread decoration-wavy underline-offset-4 hover:text-rust">
              {profile.email}
            </a>
            , or write on the note.
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
          <PaperNote seed="letter" rotate={0.8} innerClassName="p-7 sm:p-9">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="your name" name="name" value={form.name} onChange={onChange} />
                <Field label="your email" name="email" type="email" value={form.email} onChange={onChange} />
              </div>
              <Field label="what's it about" name="subject" value={form.subject} onChange={onChange} />
              <Field label="message" as="textarea" name="message" rows={4} value={form.message} onChange={onChange} />

              <div className="flex flex-wrap items-center gap-4 pt-2 font-hand text-xl">
                <button type="submit" disabled={status === "sending"} className="sketch bg-ink px-6 py-1.5 text-paper transition hover:bg-rust disabled:opacity-60">
                  {status === "sending" ? "sending…" : "send it →"}
                </button>
                <p aria-live="polite">
                  {status === "sent" && <span className="text-moss">got it, thank you! i'll write back soon.</span>}
                  {status === "error" && <span className="text-rust">hm, that didn't go through. try email instead?</span>}
                </p>
              </div>
            </form>
          </PaperNote>
        </Reveal>
      </div>
    </Section>
  );
}
