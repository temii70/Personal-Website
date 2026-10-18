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

// Phones: in from the right margin, a loop in the open space beside the heading, a swash back
// under it, then down the left side of the frame and back across underneath it. (These sit in
// the padded column, so the margins are pixels from its edges.)
const THREAD_PHONE = [
  ["calc(100% - 8px)", "-20px"],
  ["88%", "10px"],
  ["74%", "-4px"],
  ["62%", "22px"],
  ["74%", "48px"],
  ["86%", "30px"],
  ["60%", "112px"],
  ["24%", "118px"],
  ["10px", "136px"],
];
const UNDER_PHONE = [
  ["-3%", "100%"],
  ["8%", "calc(100% + 36px)"],
  ["60%", "calc(100% + 48px)"],
  ["calc(100% + 14px)", "calc(100% + 120px)"],
];

// Chapter 3½ · a sampler. Eight tiny models, stitched into one frame.
export default function Models() {
  return (
    <section id="Sampler" className="relative scroll-mt-16 py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <Vias points={THREAD} />
        <Vias points={THREAD_PHONE} className="md:hidden" />
        <ChapterTitle caption="tiny models i keep coming back to">a sampler</ChapterTitle>
        <div className="relative">
          <Vias points={UNDER_PHONE} className="md:hidden" />
          <Reveal>
            <Sampler />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
