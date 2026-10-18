import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { profile } from "../data";

const LINKS = [
  { id: "About", label: "about" },
  { id: "Experience", label: "field notes" },
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

  const link = (isActive) =>
    `underline-offset-[6px] decoration-thread decoration-wavy transition-colors hover:text-ink hover:underline ${
      isActive ? "text-ink underline" : "text-ink-soft"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-hand text-xl transition-colors duration-300 ${
        scrolled || open ? "bg-paper/90 shadow-[0_1px_0_rgba(58,52,46,0.08)] backdrop-blur" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-12">
        <a href="#top" className="text-2xl text-ink">
          temi otun
        </a>

        <div className="hidden items-center gap-7 sm:flex">
          {LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={link(active === id)}>
              {label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="sketch px-4 py-0.5 text-ink transition-colors hover:bg-ink hover:text-paper">
            resume
          </a>
        </div>

        <button className="text-ink sm:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <FaXmark size={22} /> : <FaBars size={20} />}
        </button>
      </nav>

      {open && (
        <div className="px-6 pb-6 sm:hidden">
          {[...LINKS, { id: "resume", label: "resume", href: profile.resume }].map(({ id, label, href }) => (
            <a
              key={id}
              href={href || `#${id}`}
              target={href ? "_blank" : undefined}
              rel={href ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="block py-2 text-2xl text-ink"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
