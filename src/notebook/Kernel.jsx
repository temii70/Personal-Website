import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

// A pretend Jupyter kernel. Cells ask it for an execution number when they run, so the
// counts reflect the order *you* scrolled to them, and it reports busy while any cell runs.

const Kernel = createContext(null);

export function KernelProvider({ children }) {
  const counter = useRef(0);
  const executed = useRef([]); // prompt elements that have run, used to draw the trace
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(0);

  const run = useCallback((el) => {
    counter.current += 1;
    executed.current.push(el);
    setCount(counter.current);
    return counter.current;
  }, []);
  const begin = useCallback(() => setRunning((r) => r + 1), []);
  const end = useCallback(() => setRunning((r) => Math.max(0, r - 1)), []);

  const value = useMemo(() => ({ count, busy: running > 0, run, begin, end, executed }), [count, running, run, begin, end]);
  return <Kernel.Provider value={value}>{children}</Kernel.Provider>;
}

export const useKernel = () => useContext(Kernel);
