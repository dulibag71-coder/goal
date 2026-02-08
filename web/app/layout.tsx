import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Golf Coach | Personal Swing Analysis',
    description: 'Understand your swing and get personalized AI coaching with MediaPipe analysis.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    )
}
