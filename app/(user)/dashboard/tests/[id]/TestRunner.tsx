'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Question {
  text: string;
  options: string[];
}

interface Props {
  testId: string;
  testTitle: string;
  questions: Question[];
  userId: string;
  latestResultId: string | null;
}

export function TestRunner({ testId, testTitle, questions, userId, latestResultId }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 text-center">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Энэ тестэд одоогоор асуулт байхгүй байна.
            </p>
          <Link
            href="/dashboard/tests"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Тест рүү буцах
          </Link>
          </div>
        </div>
      </main>
    );
  }

  const total = questions.length;
  const progress = Math.round(((currentIndex + 1) / total) * 100);
  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentIndex];

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from('test_results')
      .insert({
      user_id: userId,
      test_id: testId,
      answers,
        // result_summary is computed/displayed client-side for now.
      })
      .select('id')
      .single();

    if (insertError || !data?.id) {
      setError(insertError?.message ?? 'Failed to save your test results.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setDone(true);
    router.push(`/dashboard/tests/${testId}/results/${data.id}`);
    router.refresh();
  }

  if (done) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10 text-center">
          <div className="space-y-6">
          <span
            className="material-symbols-outlined mx-auto block text-[64px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Тест дууслаа!</h1>
          <p className="text-sm text-muted-foreground">
            Таны хариултууд бүртгэгдлээ. Үр дүнг тань нээж байна…
          </p>
          <Link
            href="/dashboard/tests"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Тест рүү буцах
          </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
        <Link
          href="/dashboard/tests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
          Тестээс гарах
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          {testTitle}
        </div>
        <div className="flex items-center gap-2">
          {latestResultId && (
            <Link
              href={`/dashboard/tests/${testId}/results/${latestResultId}`}
              className="hidden h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              Үр дүн харах
            </Link>
          )}
          <Link
            href={`/dashboard/tests/${testId}/results`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Миний үр дүн
          </Link>
        </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-6xl flex-grow items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-[600px] space-y-8">

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {total}-н {currentIndex + 1}-р асуулт
              </span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center">
            <h1 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
              {currentQuestion.text}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: idx }))}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-accent'
                  }`}
                >
                  <div
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? 'border-primary'
                        : 'border-border'
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full bg-primary transition-all ${
                        isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      }`}
                    />
                  </div>
                  <span
                    className={`block text-sm leading-relaxed ${
                      isSelected ? 'font-medium text-foreground' : 'text-foreground'
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Өмнөх
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Алгасах
              </button>

              {currentIndex < total - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Үргэлжлүүлэх
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Илгээж байна…' : 'Дуусгах'}
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

        </div>
      </main>
    </div>
  );
}
