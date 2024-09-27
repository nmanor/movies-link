import {Metadata, Viewport} from "next";
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'Movie Links',
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: 'black',
};

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}
