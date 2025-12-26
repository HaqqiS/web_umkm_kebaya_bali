import React from 'react'
import { Nunito_Sans } from 'next/font/google'
import './global.css'

// Setup Font
const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={nunito.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
