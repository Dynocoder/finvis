"use client"

// app/layout.tsx
import Link from 'next/link'
import { SearchBar } from './components/SearchBar'
import './globals.css'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathName = usePathname();
  const isHomePage = pathName === "/";

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Navbar with Search */}
        <header className="bg-white shadow-sm">
          <nav className="flex align-middle justify-between container mx-auto px-4 py-4">
            <Link href="/" className='flex flex-row gap-2 items-center '>
              <span>
                <img className='size-12' src="./favicon.ico" alt="" />
              </span>
              <span>
                <h2>FinVis</h2>
              </span>
            </Link>
            {!isHomePage && (
              <SearchBar />
            )}
          </nav>
        </header>

        {/* Main Content */}
        <main className="">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">
            <p>Created by Saurav Prashar • © 2025</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
