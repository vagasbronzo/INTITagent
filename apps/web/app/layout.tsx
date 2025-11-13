import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'INTITagent - AI Assistant',
  description: 'On-premise AI assistant for Business Cube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
