import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { useKernel } from "../notebook/Kernel";
import { profile } from "../data";

const LINKS = [
  { id: "About", label: "about" },
  { id: "Experience", label: "experience" },
  { id: "Projects", label: "projects" },
  { id: "Contact", label: "contact" },
];

// Notebook toolbar: file name, section links, kernel status.
export default function Nav() {
  const { busy } = useKernel();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    // highlight whichever section crosses the middle of the screen
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 font-mono text-[13px] sm:px-8">
        <a href="#top" className="flex items-center gap-2 text-ink">
          <img src="/favicon.svg" alt="" className="h-5 w-5" />
          temi_otun.ipynb
        </a>

        <div className="hidden items-center gap-6 text-ink-soft sm:flex">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`border-b pb-0.5 transition-colors hover:text-ink ${active === id ? "border-orange text-ink" : "border-transparent"}`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-xs text-ink-soft lg:flex" title={busy ? "kernel busy" : "kernel idle"}>
            Python 3 (curiosity)
            <span className={`h-2.5 w-2.5 rounded-full border-2 border-ink-soft transition-colors ${busy ? "animate-pulse border-orange bg-orange" : ""}`} />
          </span>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-sm border border-ink px-3 py-1 text-ink transition-colors hover:bg-ink hover:text-paper sm:block"
          >
            resume.pdf ↗
          </a>
          <button className="text-ink sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <FaXmark size={20} /> : <FaBars size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-2 font-mono text-sm sm:hidden">
          {[...LINKS, { id: "resume", label: "resume.pdf ↗", href: profile.resume }].map(({ id, label, href }) => (
            <a
              key={id}
              href={href || `#${id}`}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
