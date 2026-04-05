import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '300 APM',
  description: '300 APM Next.js Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
