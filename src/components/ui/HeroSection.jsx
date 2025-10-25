"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroSection({ featured = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!featured.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (!featured.length) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Koseli Colorado</h1>
      </section>
    );
  }

  const current = featured[index];

  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Blurred Image */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`blur-${current.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={current.bannerUrl || "/hero-bg.jpg"}
              alt={`${current.title} blurred background`}
              fill
              sizes="100vw"
              className="object-cover blur-lg scale-105"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Foreground Main Image */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={current.bannerUrl || "/hero-bg.jpg"}
              alt={current.title}
              fill
              priority
              sizes="100vw"
              className="object-contain object-center relative z-5"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text Content */}
      <div className="relative z-10 px-6 max-w-3xl text-white drop-shadow-lg">
        <motion.h1
          key={current.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
        >
          {current.title}
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-100 mb-4">
          {current.description ||
            "Bringing the Nepali community together through music, culture, and celebration."}
        </p>
        {current.date && (
          <p className="text-sm text-gray-300 mt-2">
            {new Date(current.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-8 flex gap-3 z-10">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-brand-primary scale-110" : "bg-gray-400/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
