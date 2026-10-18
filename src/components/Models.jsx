import Reveal from "./ui/Reveal";
import { ChapterTitle } from "./ui/Chapter";
import Sampler from "../art/Sampler";

// Chapter 3½ · a sampler. Eight tiny models, stitched into one frame.
export default function Models() {
  return (
    <section id="Sampler" className="relative scroll-mt-16 py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10">
        <ChapterTitle caption="tiny models i keep coming back to">a sampler</ChapterTitle>
        <Reveal>
          <Sampler />
        </Reveal>
      </div>
    </section>
  );
}
