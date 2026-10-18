import { motion, useReducedMotion } from "framer-motion";

// Gentle fade-up the first time something scrolls into view (skipped for reduced motion).
export default function Reveal({ children, delay = 0, className = "" }) {
  const still = useReducedMotion();
  if (still) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
