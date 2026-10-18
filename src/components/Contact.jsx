import { useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Reveal from "./ui/Reveal";
import { CodeCell, MarkdownCell, H2 } from "../notebook/Cell";
import { profile } from "../data";

const EMPTY = { name: "", email: "", subject: "", message: "" };

// Looks like an ipywidgets form.
const Field = ({ label, as: Tag = "input", ...props }) => (
  <label className="grid items-start gap-1 sm:grid-cols-[6rem_1fr] sm:gap-3">
    <span className="pt-2 font-mono text-[13px] text-ink-soft sm:text-right">{label}</span>
    <Tag
      {...props}
      required
      className="w-full resize-y rounded-sm border border-line bg-white/80 px-3 py-2 text-base text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20"
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
    setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <section id="Contact" className="scroll-mt-20 space-y-10 pt-28">
      <MarkdownCell>
        <Reveal>
          <H2>Say hi</H2>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>Looking for ML, data or software roles, research collaborations, or just someone to argue about the Lakers with.</p>
            <p>
              Email{" "}
              <a href={`mailto:${profile.email}`} className="text-ink underline decoration-orange underline-offset-4 hover:text-orange">
                {profile.email}
              </a>
              , or run the cell below.
            </p>
            <div className="flex gap-5 pt-1">
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink">
                <FaGithub size={22} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink">
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>
        </Reveal>
      </MarkdownCell>

      <CodeCell code={`temi.send_message(name, email, subject, message)  # i read every one`}>
        <form onSubmit={onSubmit} className="max-w-xl space-y-3">
          <Field label="name" name="name" value={form.name} onChange={onChange} />
          <Field label="email" name="email" type="email" value={form.email} onChange={onChange} />
          <Field label="subject" name="subject" value={form.subject} onChange={onChange} />
          <Field label="message" as="textarea" name="message" rows={4} value={form.message} onChange={onChange} />
          <div className="sm:pl-[6.75rem]">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-sm bg-ink px-4 py-2 font-mono text-[13px] text-paper transition hover:bg-orange disabled:opacity-60"
            >
              {status === "sending" ? "running…" : "▶ run"}
            </button>
          </div>
        </form>

        <div aria-live="polite" className="mt-4 max-w-xl font-mono text-[13px]">
          {status === "sent" && <p className="text-ink">message sent ✓ i'll write back soon.</p>}
          {status === "error" && (
            <p className="rounded-sm bg-[#fbe3dc] px-3 py-2 text-signal">
              ConnectionError: that didn't go through. try emailing me instead?
            </p>
          )}
        </div>
      </CodeCell>
    </section>
  );
}
