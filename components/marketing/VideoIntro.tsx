import { Reveal } from "./reveal";
import VideoIntroPlayer from "./video-intro-player";

export default function VideoIntro() {
  return (
    <section
      id="taniltsuulga"
      className="scroll-mt-24 border-b border-border/40 bg-[#FAFAF7] py-20 md:py-28"
      aria-labelledby="video-intro-title"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1F4D3F]">
            Танилцуулга
          </p>
          <h2
            id="video-intro-title"
            className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Энэ юу болохыг 90 секундэд
          </h2>
        </Reveal>

        <Reveal className="mt-10 md:mt-14">
          <VideoIntroPlayer />
        </Reveal>
      </div>
    </section>
  );
}
