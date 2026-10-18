import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Interlude from "./components/Interlude";
import Projects from "./components/Projects";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { KernelProvider } from "./notebook/Kernel";
import Trace from "./notebook/Trace";

// The whole site is one Jupyter notebook: markdown cells for prose, code cells whose
// outputs are the art. Cells execute as you scroll to them.
export default function Home() {
  return (
    <KernelProvider>
      <div className="min-h-screen bg-paper font-serif text-ink antialiased selection:bg-marker">
        <Nav />
        <main className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <Trace />
          <Hero />
          <About />
          <Experience />
          <Interlude />
          <Projects />
          <Interests />
          <Contact />
        </main>
        <Footer />
      </div>
    </KernelProvider>
  );
}
