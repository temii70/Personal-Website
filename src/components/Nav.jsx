import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { profile } from "../data";

const LINKS = [
  { id: "About", label: "pulse" },
  { id: "Experience", label: "forecast" },
  { id: "Projects", label: "projects" },
  { id: "Contact", label: "say hi" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // highlight whichever chapter crosses the middle of the screen
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "bg-paper/85 backdrop-blur" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 font-mono text-sm lowercase sm:px-10">
        <a href="#top" className="text-ink">
          temi otun
        </a>

        <div className="hidden items-center gap-7 sm:flex">
          {LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={`transition-colors hover:text-blue ${active === id ? "text-blue" : "text-ink-soft"}`}>
              {active === id && <span className="mr-1 text-pink">+</span>}
              {label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-pink decoration-2 underline-offset-4 hover:text-blue">
            resume ↗
          </a>
        </div>

        <button className="text-ink sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <FaXmark size={20} /> : <FaBars size={18} />}
        </button>
      </nav>

      {open && (
        <div className="px-6 pb-6 font-mono lowercase sm:hidden">
          {[...LINKS, { id: "resume", label: "resume ↗", href: profile.resume }].map(({ id, label, href }) => (
            <a
              key={id}
              href={href || `#${id}`}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-lg text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
