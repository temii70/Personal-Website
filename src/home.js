import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Interlude from "./components/Interlude";
import Projects from "./components/Projects";
import Interests from "./components/Interests";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Thread from "./art/Thread";

export default function Home() {
  return (
    <div className="relative bg-paper font-serif text-ink antialiased selection:bg-thread/30">
      <Nav />
      <Thread />
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
