"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-40 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-amber-600">
            The Golden Fork
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#menu" className="text-stone-600 hover:text-amber-600 transition">Menu</Link>
            <Link href="#about" className="text-stone-600 hover:text-amber-600 transition">About</Link>
            <Link href="#location" className="text-stone-600 hover:text-amber-600 transition">Location</Link>
            <Link href="/book" className="bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-amber-600 transition">
              Book a Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-900">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <Link href="#menu" onClick={() => setIsOpen(false)} className="block py-3 text-stone-600 text-lg">Menu</Link>
          <Link href="#about" onClick={() => setIsOpen(false)} className="block py-3 text-stone-600 text-lg">About</Link>
          <Link href="#location" onClick={() => setIsOpen(false)} className="block py-3 text-stone-600 text-lg">Location</Link>
          <Link href="/book" onClick={() => setIsOpen(false)} className="block mt-4 text-center bg-stone-900 text-white px-5 py-3 rounded-full text-lg">
            Book a Table
          </Link>
        </div>
      )}
    </nav>
  );
}