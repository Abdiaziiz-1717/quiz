import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OS quiz',
  description: 'Created by Abdiaziiz',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
       <footer
  style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '14px',
    background: 'transparent',
    borderTop: '1px solid #ccc',
    zIndex: 1000, // Ensures it's always on top
  }}
>
  Link:{" "}
  <a
    href="https://drive.google.com/file/d/1WsvuXq8wPfc0g5YIi9_qGit-GwPe_A20/view?usp=sharing"
    target="_blank"
    rel="noopener noreferrer"
  >
    PDF file
  </a>{" "}
  | Created by Abdiaziiz
</footer>

    </html>
  )
}
