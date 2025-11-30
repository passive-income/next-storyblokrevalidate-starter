import './globals.css'

export const metadata = {
    title: 'Next 16 Revalidate Starter',
    description: 'Starterprojekt mit App Router und gezielter Cache-Invalidierung'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body>{children}</body>
        </html>
    )
}