import './globals.css'
import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'The Climate Watch',
  description: 'Building a Sustainable Eswatini through community-driven climate action, advocacy, and education.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body>
        <header>
          <nav>
            {/* Navigation links */}
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/impact">Impact</Link></li>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/get-involved">Get Involved</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2024 The Climate Watch. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
