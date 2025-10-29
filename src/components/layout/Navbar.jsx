"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
        scrolled
          ? "bg-black/50 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto relative flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/image 4.png"
            alt="Koseli Colorado Logo"
            width={scrolled ? 130 : 160}
            height={scrolled ? 130 : 160}
            className="object-contain transition-all duration-700 ease-in-out max-w-[160px] sm:max-w-[180px]"
            priority
          />
        </Link>

        {/* Centered Desktop Menu (Visible from lg and up) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8 xl:space-x-10">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? "text-[#E63946] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#E63946] after:rounded-full"
                    : "text-white hover:text-[#E63946]"
                } ${scrolled ? "text-base" : "text-lg"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile & Tablet Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex flex-col items-center justify-center space-y-1 focus:outline-none"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile & Tablet Menu Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-black/95 border-t border-gray-800 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 py-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-[#E63946]"
                      : "text-gray-300 hover:text-[#E63946]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
