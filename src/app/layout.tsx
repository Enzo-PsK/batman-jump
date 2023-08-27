import "./style/globals.css";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
    title: "Batman Jump",
    description: "Batman Jump in NextJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={pixelFont.className}>{children}</body>
        </html>
    );
}
