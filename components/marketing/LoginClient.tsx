"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getEffectiveStatus } from "@/lib/subscription";
import LoginPageShell from "@/components/marketing/LoginPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginClient() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Имэйл эсвэл нууц үг буруу байна.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, subscription_status, subscription_expires_at")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      window.location.href = "/payment";
      return;
    }

    const status = getEffectiveStatus(profile);
    const destinations: Record<string, string> = {
      admin: "/admin/dashboard",
      active: "/dashboard",
      pending: "/status/pending",
      denied: "/status/denied",
      expired: "/status/expired",
      inactive: "/payment",
    };
    window.location.href = destinations[status] ?? "/payment";
  }

  return (
    <LoginPageShell>
      <Card className="rounded-2xl border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Нууц үгээ оруулна уу"
                required
                autoComplete="current-password"
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
              disabled={loading}
              className="h-11 w-full rounded-xl text-sm font-medium transition-colors duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-0 border-t border-border px-6 pb-8 pt-6 md:px-8">
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl border-border bg-background text-sm font-medium transition-colors duration-200 ease-out hover:bg-accent motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            <Link href="/register">Шинэ бүртгэл үүсгэх</Link>
          </Button>
        </CardFooter>
      </Card>
    </LoginPageShell>
  );
}
