"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Upgrade", href: "/upgrade" },
  { name: "How It Works", href: "/how-it-works" },
];

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
          setIsVisible(false);
        } else if (lastScrollY.current - currentScrollY > 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      clearTimeout(timer);
    };
  }, []);

  return (
    <nav
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 md:-translate-y-24 opacity-0"
      } ${hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="w-[92vw] max-w-5xl mx-auto">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 md:px-8 md:py-3 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                
                    style={{ filter: 'invert(1) brightness(800%)' }}
              />
              <h1 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              
              </h1>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
                {/* <button className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-5 py-2 rounded-full flex items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-lg"> */}
                  {/* <span>Upgrade</span> */}
                  {/* <ArrowRight size={16} /> */}
                {/* </button> */}
              <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white hover:scale-110 transition-transform duration-200"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 font-medium transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2" />
            <div className="flex items-center justify-between">
              <UserButton afterSignOutUrl="/" />
              
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
