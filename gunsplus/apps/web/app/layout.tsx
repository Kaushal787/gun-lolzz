import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'gunsplus | Home',
  description: 'Modern link-in-bio + media hosting for creators.',
  applicationName: 'gunsplus',
  themeColor: '#573362',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

