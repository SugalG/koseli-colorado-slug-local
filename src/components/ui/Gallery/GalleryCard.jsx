"use client";
import Image from "next/image";

export default function GalleryCard({ album, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer 
                 hover:scale-[1.03] transition-transform duration-300 group 
                 shadow-md hover:shadow-lg border border-gray-800"
    >
      <div className="relative w-full h-56">
        <Image
          src={album.coverUrl || album.images?.[0]?.imageUrl || "/placeholder.jpg"}
          alt={album.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 flex flex-col items-start">
        <h3 className="text-lg font-semibold text-white">{album.name}</h3>
        <p className="text-sm text-gray-400">
          {album.images?.length || 0} {album.images?.length === 1 ? "photo" : "photos"}
        </p>
      </div>
    </div>
  );
}
