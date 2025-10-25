"use client";
import { useState, useEffect } from "react";
import GalleryHeader from "@/components/ui/Gallery/GalleryHeader";
import GalleryGrid from "@/components/ui/Gallery/GalleryGrid";
import GalleryLightbox from "@/components/ui/Gallery/GalleryLightbox";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? "" : "http://localhost:3000");

    fetch(`${base}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setTimeout(() => setLoading(false), 400); // small delay for smooth fade
      })
      .catch((err) => {
        console.error("Failed to load gallery:", err);
        setLoading(false);
      });
  }, []);

  const openModal = (i) => setCurrentIndex(i);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen transition-all duration-700 ease-in-out">
      <GalleryHeader />

      {loading ? (
        <div className="flex items-center justify-center h-[60vh] animate-fadeIn">
          <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="ml-4 text-brand-primary text-lg font-medium">Loading gallery...</p>
        </div>
      ) : images.length > 0 ? (
        <GalleryGrid images={images} openModal={openModal} />
      ) : (
        // 💬 Friendly empty state
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fadeIn">
          <p className="text-gray-400 text-lg mb-3">No images added yet.</p>
          <p className="text-gray-500 text-sm">
            Please check back soon for new gallery updates!
          </p>
        </div>
      )}

      <GalleryLightbox
        images={images}
        currentIndex={currentIndex}
        onClose={closeModal}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </main>
  );
}
