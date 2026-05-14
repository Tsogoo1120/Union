"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authDebug } from "@/lib/auth/auth-debug";
import {
  formatTooManyAttemptsMessage,
  getAuthErrorStatus,
  isAuthEmailRateLimited,
  suggestedWaitSecondsFromAuthError,
} from "@/lib/auth/supabase-auth-errors";
import RegisterPageShell from "@/components/marketing/RegisterPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [, setCooldownTick] = useState(0);

  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!cooldownUntil || Date.now() >= cooldownUntil) return;
    const id = window.setInterval(() => setCooldownTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [cooldownUntil]);

  const cooldownRemainingSec =
    cooldownUntil != null && Date.now() < cooldownUntil
      ? Math.ceil((cooldownUntil - Date.now()) / 1000)
      : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const fullName = (form.elements.namedItem("full_name") as HTMLInputElement).value.trim();
      const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;
      const confirmPassword = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

      if (password !== confirmPassword) {
        setError("Нууц үг таарахгүй байна.");
        return;
      }

      const supabase = createClient();
      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
        },
      });

      authDebug("signUp.result", {
        ok: !signUpError,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        redirectOriginSet: !!emailRedirectTo,
        errorStatus: signUpError ? getAuthErrorStatus(signUpError) : undefined,
      });

      if (signUpError) {
        if (isAuthEmailRateLimited(signUpError)) {
          const wait = suggestedWaitSecondsFromAuthError(signUpError);
          setCooldownUntil(Date.now() + wait * 1000);
          setError(formatTooManyAttemptsMessage(wait));
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (!data.session) {
        setEmailSent(true);
        return;
      }

      router.push("/payment");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <RegisterPageShell emailSent>
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-6 pt-8 text-center md:p-8">
            <MailCheck
              className="mx-auto h-14 w-14 text-primary"
              strokeWidth={1.25}
              aria-hidden
            />
            <div className="mt-6 space-y-2">
              <h1 className="font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Имэйлээ шалгана уу
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Баталгаажуулах холбоосыг имэйл хаяг руу тань илгээлээ. Холбоос дээр дарж
                бүртгэлээ идэвхжүүлээд нэвтэрнэ үү.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-6 pb-8 pt-0 md:px-8">
            <Button asChild variant="link" className="h-auto rounded-xl p-0 text-sm font-medium">
              <Link href="/login" className="text-primary underline underline-offset-4">
                Нэвтрэх хуудас руу очих
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </RegisterPageShell>
    );
  }

  return (
    <RegisterPageShell emailSent={false}>
      <Card className="rounded-2xl border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Бүтэн нэр</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Таны нэр"
                required
                autoComplete="name"
                className="min-h-11 rounded-lg sm:h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Имэйл</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="min-h-11 rounded-lg sm:h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Хамгийн багадаа 8 тэмдэгт"
                required
                minLength={8}
                autoComplete="new-password"
                className="min-h-11 rounded-lg sm:h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Нууц үг баталгаажуулах</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Нууц үгээ давтана уу"
                required
                minLength={8}
                autoComplete="new-password"
                className="min-h-11 rounded-lg sm:h-10"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={loading || cooldownRemainingSec > 0}
              className="h-11 w-full rounded-xl text-sm font-medium transition-colors duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {loading
                ? "Бүртгэл үүсгэж байна…"
                : cooldownRemainingSec > 0
                  ? `Хүлээгээрэй (${cooldownRemainingSec}с)…`
                  : "Бүртгэл үүсгэх"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-0 border-t border-border px-6 pb-8 pt-6 md:px-8">
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl border-border bg-background text-sm font-medium transition-colors duration-200 ease-out hover:bg-accent motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            <Link href="/login">Нэвтрэх</Link>
          </Button>
        </CardFooter>
      </Card>
    </RegisterPageShell>
  );
}
