import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { profile } from "../data";

const LINKS = [
  { id: "About", label: "about" },
  { id: "Experience", label: "notes" },
  { id: "Projects", label: "projects" },
  { id: "Contact", label: "contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // highlight whichever section crosses the middle of the screen
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-ink/10 bg-paper/90 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-12">
        <a href="#top" className="font-display text-xl italic text-ink">
          Temi Otun
        </a>

        <div className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.15em] sm:flex">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`border-b pb-0.5 transition-colors hover:text-ink ${active === id ? "border-signal text-ink" : "border-transparent text-ink-soft"}`}
            >
              {label}
            </a>
          ))}
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink px-3 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            resume ↗
          </a>
        </div>

        <button className="text-ink sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <FaXmark size={22} /> : <FaBars size={20} />}
        </button>
      </nav>

      {open && (
        <div className="px-6 pb-6 font-mono text-sm uppercase tracking-[0.15em] sm:hidden">
          {[...LINKS, { id: "resume", label: "resume ↗", href: profile.resume }].map(({ id, label, href }) => (
            <a
              key={id}
              href={href || `#${id}`}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="block py-3 text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
