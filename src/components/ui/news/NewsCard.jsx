"use client";
import Link from "next/link";
import Image from "next/image";

export default function NewsCard({ item }) {
    const date = new Date(item.date || item.createdAt).toLocaleDateString(
        undefined,
        { year: "numeric", month: "short", day: "numeric" }
    );

    return (
        <Link
            href={`/news/${item.slug}`}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 block group hover:shadow-xl transition-all duration-500"
        >
            {/* 🖼️ Banner */}
            {item.bannerUrl && (
                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                    <Image
                        src={item.bannerUrl}
                        alt={item.title}
                        loading="lazy"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                    />
                </div>
            )}

            {/* 📰 Content */}
            <div className="p-6 flex flex-col justify-between bg-white">
                <div>
                    <h2 className="text-2xl font-semibold text-brand-primary mb-2 group-hover:text-[#ff4e50] transition-colors">
                        {item.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-3">{date}</p>
                    <p className="text-gray-700 leading-relaxed line-clamp-5">
                        {item.content}
                    </p>
                </div>
            </div>
        </Link>
    );
}
