import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: 'EduRova - Find Your Dream College',
    description: 'Discover, compare and predict colleges across India',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${geist.className} antialiased min-h-screen`} suppressHydrationWarning={true}>
                {children}
            </body>
        </html>
    )
}