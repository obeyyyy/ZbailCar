"use client"
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png" // Make sure to add your logo file
              alt="Zbail Cars"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-8">
            <a href="mailto:contact@zbailcars.com" className="text-[#B38E3B] hover:text-[#D4AF37] transition-colors">
              contact@zbailcars.com
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-2 border border-[#B38E3B] text-[#D4AF37] hover:bg-[#B38E3B] hover:text-black rounded-full transition-all"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-[#B38E3B] hover:text-[#D4AF37]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
