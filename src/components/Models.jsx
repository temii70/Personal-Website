import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import Sampler from "../art/Sampler";
import { Vias } from "../art/SignalLine";

// The line arrives from the left, past the caption, swashes under the heading, loops once after
// the word, then heads right above the frame and leaves down the right margin toward the flock.
const THREAD = [
  ["-3%", "4px"],
  ["-1%", "84px"],
  ["10%", "98px"],
  ["24%", "94px"],
  ["35%", "72px"],
  ["39%", "40px"],
  ["33%", "24px"],
  ["28%", "46px"],
  ["40%", "78px"],
  ["72%", "58px"],
  ["104%", "80px"],
];

// Chapter 3½ · a sampler. Eight tiny models, stitched into one frame.
export default function Models() {
  return (
    <section id="Sampler" className="relative scroll-mt-16 py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <Vias points={THREAD} />
        <ChapterTitle caption="tiny models i keep coming back to">a sampler</ChapterTitle>
        <Reveal>
          <Sampler />
        </Reveal>
      </div>
    </section>
  );
}
