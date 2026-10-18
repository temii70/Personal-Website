import { FiArrowUpRight } from "react-icons/fi";

// The little "opens elsewhere" arrow. Drawn as an icon rather than the ↗ character, which
// phones render as a colour emoji; hidden on phones altogether.
export default function Out() {
  return <FiArrowUpRight aria-hidden className="ml-0.5 hidden align-[-0.1em] sm:inline" />;
}
