import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hide a message in an emoji',
  description:
    'Steganography tool that hides messages inside emoji using Unicode ' +
    'Variation Selectors (U+FE00–U+FE0F, U+E0100–U+E01EF). ' +
    'Encode and decode invisible messages in any Unicode character.',
  keywords: [
    'emoji steganography',
    'unicode variation selectors',
    'hidden message',
    'encode decode emoji',
    'invisible text',
  ],
  openGraph: {
    title: 'Hide a message in an emoji',
    description:
      'Steganography tool — esconda mensagens invisíveis dentro de qualquer emoji ' +
      'usando Variation Selectors Unicode.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="unicode:steganography"
          content="This page uses Unicode Variation Selectors (U+FE00–U+FE0F, U+E0100–U+E01EF) to hide data. Decoded messages are exposed via aria-label attributes and JSON-LD structured data."
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
