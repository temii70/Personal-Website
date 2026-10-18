import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Interlude from "./components/Interlude";
import Projects from "./components/Projects";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SignalLine from "./art/SignalLine";

// "signal": one line runs the whole page and changes shape chapter by chapter —
// noise, a heartbeat, a career forecast, a flock, a clothesline, a basketball arc, a flat line.
export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-paper font-serif text-ink antialiased selection:bg-yellow/60">
      <Nav />
      <SignalLine />
      <main>
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
  );
}
