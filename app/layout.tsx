import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DownCloudMe – SoundCloud to MP3 Downloader & Converter",
  description: "Convert and download SoundCloud tracks, sets, and playlists in high quality MP3 instantly. No registration or software required.",
  openGraph: {
    title: "DownCloudMe – SoundCloud to MP3 Downloader & Converter",
    description: "Convert and download SoundCloud tracks, sets, and playlists in high quality MP3 instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to download SoundCloud songs on iPhone or Android?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the SoundCloud track link, paste it into our search box above, wait for metadata resolution, and tap Download MP3."
        }
      },
      {
        "@type": "Question",
        "name": "Is DownCloudMe 100% free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DownCloudMe is completely free with no registration or subscriptions required."
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
