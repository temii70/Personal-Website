import { useKernel } from "../notebook/Kernel";

export default function Footer() {
  const { count, busy } = useKernel();
  return (
    <footer className="mx-auto mt-28 max-w-5xl border-t border-line px-5 py-10 font-mono text-xs text-ink-soft sm:px-8">
      kernel {busy ? "busy" : "idle"} · {count} cells executed · © {new Date().getFullYear()} Temi Otun
    </footer>
  );
}
