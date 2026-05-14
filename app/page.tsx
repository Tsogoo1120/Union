import type { Metadata } from "next";
import LandingPage from "@/components/marketing/LandingPage";
import { OG_IMAGE_SRC } from "@/components/marketing/image-assets";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "The Empathetic Analyst",
      url: siteUrl,
      founder: {
        "@type": "Person",
        name: "Г.Алтанцог",
      },
    },
    {
      "@type": "Product",
      "@id": `${siteUrl}/#product`,
      name: "The Empathetic Analyst гишүүнчлэл",
      description:
        "Сэтгэл зүйн тест, collective тарот уншлага, community, видео хичээл багтсан сарын захиалга.",
      brand: { "@type": "Brand", name: "The Empathetic Analyst" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MNT",
        price: "50000",
        priceValidUntil: "2027-12-31",
        url: `${siteUrl}/register`,
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    absolute: "Сэтгэл зүй & тарот | Empathetic Analyst",
  },
  description:
    "Сэтгэл зүйн тест, collective уншлага, видео хичээл. Сарын 50,000₮. Боловсролын платформ — The Empathetic Analyst.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Сэтгэл зүй & тарот | Empathetic Analyst",
    description:
      "Сэтгэл зүйн тест, collective уншлага, видео хичээл. Сарын 50,000₮. Боловсролын платформ — The Empathetic Analyst.",
    url: siteUrl,
    siteName: "The Empathetic Analyst",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: OG_IMAGE_SRC,
        width: 1200,
        height: 630,
        alt: "The Empathetic Analyst — сэтгэл зүй, видео агуулга",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Сэтгэл зүй & тарот | Empathetic Analyst",
    description:
      "Сэтгэл зүйн тест, collective уншлага, видео хичээл. Сарын 50,000₮.",
    images: [OG_IMAGE_SRC],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
