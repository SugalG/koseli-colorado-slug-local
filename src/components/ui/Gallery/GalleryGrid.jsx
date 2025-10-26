"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GalleryGrid({ images, openModal }) {
  if (!images?.length)
    return <p className="text-center text-gray-400">No images added yet.</p>;

  // Animation variants for smooth staggered fade-in
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {images.map((img, index) => (
          <motion.figure
            key={img.id}
            variants={item}
            onClick={() => openModal(index)}
            className="relative group overflow-hidden rounded-xl bg-gray-900 cursor-pointer shadow-lg"
          >
            {/* Image */}
            <div className="relative w-full h-[300px] md:h-[320px]">
              <Image
                src={img.imageUrl}
                alt={img.caption || "Gallery image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Overlay caption */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              {img.caption && (
                <figcaption className="w-full bg-black/60 text-gray-100 text-sm text-center py-2 truncate">
                  {img.caption}
                </figcaption>
              )}
            </div>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
