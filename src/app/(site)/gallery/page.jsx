"use client";
import { useState, useEffect } from "react";
import GalleryHeader from "@/components/ui/Gallery/GalleryHeader";
import GalleryGrid from "@/components/ui/Gallery/GalleryGrid";
import GalleryLightbox from "@/components/ui/Gallery/GalleryLightbox";
import GalleryCard from "@/components/ui/Gallery/GalleryCard";

export default function GalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load albums on mount
  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? "" : "http://localhost:3000");

    async function fetchAlbums() {
      try {
        const res = await fetch(`${base}/api/albums`);
        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch albums:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  //  Load images for selected album
  async function openAlbum(album) {
    setLoading(true);
    setCurrentAlbum(album);
    try {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (typeof window !== "undefined" ? "" : "http://localhost:3000");
      const res = await fetch(`${base}/api/gallery?albumId=${album.id}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load album images:", err);
    } finally {
      setLoading(false);
    }
  }

  //  Go back to album view
  const backToAlbums = () => {
    setCurrentAlbum(null);
    setImages([]);
  };

  const openModal = (i) => setCurrentIndex(i);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  //  Rendering
  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen transition-all duration-700 ease-in-out">
      <GalleryHeader />

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="ml-4 text-brand-primary text-lg font-medium">Loading...</p>
        </div>
      ) : !currentAlbum ? (
        // 🎞 Album Grid
        albums.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto p-6">
            {albums.map((album) => (
              <GalleryCard
                key={album.id}
                album={album}
                onClick={() => openAlbum(album)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <p className="text-gray-400 text-lg mb-3">No albums yet.</p>
            <p className="text-gray-500 text-sm">
              Please check back soon for new galleries!
            </p>
          </div>
        )
      ) : (
        //  Album Detail Grid
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={backToAlbums}
            className="mb-6 text-sm text-gray-300 hover:text-brand-primary transition"
          >
            ← Back to Albums
          </button>
          <h2 className="text-2xl font-bold mb-4">{currentAlbum.name}</h2>

          {images.length > 0 ? (
            <GalleryGrid images={images} openModal={openModal} />
          ) : (
            <p className="text-gray-400 text-center">No images in this album yet.</p>
          )}

          {currentIndex !== null && (
            <GalleryLightbox
              images={images}
              currentIndex={currentIndex}
              onClose={closeModal}
              onPrev={prevImage}
              onNext={nextImage}
            />
          )}
        </div>
      )}
    </main>
  );
}
