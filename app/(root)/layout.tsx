import { ClerkProvider } from '@clerk/nextjs'
import '../global.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Topbar, LeftSidebar, RightSidebar, Bottombar } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Topbar />

          <main className='flex flex-row'>
            <LeftSidebar />

            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </ClerkProvider>
      </body>
    </html>
  )
}
