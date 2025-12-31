import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '威士忌評論網站',
  description: '威士忌評論與分享平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}

