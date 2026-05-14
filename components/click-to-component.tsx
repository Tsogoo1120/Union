"use client";

import dynamic from "next/dynamic";

const CTC = dynamic(
  () => import("click-to-react-component").then((m) => ({ default: m.ClickToComponent })),
  { ssr: false }
);

export function ClickToComponent() {
  return <CTC editor="vscode" />;
}
