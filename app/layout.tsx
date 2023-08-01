import './globals.css'
import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'

const publicSans = Public_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard Demo',
  description: 'Dashboard Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={publicSans.className}>{children}</body>
    </html>
  )
}
