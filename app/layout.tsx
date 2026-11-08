import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import localFont from "next/font/local";
import { CursorLabel } from "./components/CursorLabel";
import "./globals.css";

// Array Regular (headings). Lighter weights keep its dot texture subtle.
const array = localFont({
  variable: "--font-array",
  display: "swap",
  src: [{ path: "./fonts/Array-Regular.otf", weight: "400", style: "normal" }],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: "600",
});

// Khand (body): condensed sans, Light to Bold.
const khand = localFont({
  variable: "--font-khand",
  display: "swap",
  src: [
    { path: "./fonts/Khand-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/Khand-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Khand-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Khand-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/Khand-Bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Liz Stolnicki — UX & product designer",
  description:
    "Portfolio of Liz Stolnicki, a technical UX designer for complex systems. Selected work: Blue Origin, Commit2Fit, Uber.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${array.variable} ${unbounded.variable} ${khand.variable}`}>
      <body>
        {children}
        <CursorLabel />
      </body>
    </html>
  );
}
