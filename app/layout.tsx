import type { Metadata } from "next";
import { Newsreader, Source_Sans_3, Unbounded } from "next/font/google";
import { CursorLabel } from "./components/CursorLabel";
import "./globals.css";

// Newsreader: all headings (editorial serif).
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

// Unbounded: the name only (hero and nav pill).
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

// Source Sans 3: body and UI text.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liz Stolnicki — UX & product designer",
  description:
    "Portfolio of Liz Stolnicki, a technical UX designer for complex systems. Selected work: Blue Origin, Commit2Fit, Uber.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${unbounded.variable} ${sourceSans.variable}`}>
      <body>
        {children}
        <CursorLabel />
      </body>
    </html>
  );
}
