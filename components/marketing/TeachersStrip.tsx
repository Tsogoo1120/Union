import { Reveal } from "./reveal";
import { TEACHER_NAMES } from "./constants";

export default function TeachersStrip() {
  return (
    <section
      className="border-b border-border/40 bg-muted/30 py-14 md:py-16"
      aria-labelledby="teachers-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2
            id="teachers-heading"
            className="text-center font-display text-xl font-medium tracking-tight text-foreground md:text-2xl"
          >
            Эдгээр мэргэжилтнүүдээс сурсан агуулгууд
          </h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 md:justify-center md:overflow-visible md:pb-0">
            {TEACHER_NAMES.map((name) => (
              <div
                key={name}
                className="min-w-[200px] shrink-0 rounded-2xl border border-border/60 bg-background px-6 py-4 text-center shadow-sm md:min-w-0"
              >
                <p className="font-display text-base font-medium text-foreground md:text-lg">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
