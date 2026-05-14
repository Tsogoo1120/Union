import type { Metadata } from "next";
import LoginClient from "@/components/marketing/LoginClient";

export const metadata: Metadata = {
  title: "Нэвтрэх",
};

export default function LoginPage() {
  return <LoginClient />;
}
