export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-ink/10 bg-paper py-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
      end of notebook · © {new Date().getFullYear()} Temi Otun
    </footer>
  );
}
