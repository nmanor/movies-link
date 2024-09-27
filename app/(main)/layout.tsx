import NavigationBar from "@/components/shared/NavigationBar/NavigationBar";

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        {children}
        <NavigationBar/>
        </body>
        </html>
    )
}
