import Head from 'next/head'
import './globals.css';
import { Inter } from 'next/font/google';
import MenuBar from './MenuBar';
import Footer from './Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fried Liver',
  description: 'Memorize Chess Openings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={inter.className}>
        <div className="flex flex-col text-slate-300 min-h-screen">
          <MenuBar />
            {children}
          <div className="flex-grow bg-slate-800">
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>

    </html>
  )
}
