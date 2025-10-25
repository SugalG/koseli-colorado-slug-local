"use client";
import Image from "next/image";
import Link from "next/link";

export default function NewsSection({ news = [] }) {
  const hasNews = Array.isArray(news) && news.length > 0;

  return (
    <section className="relative bg-white py-24 px-6 md:px-12 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Latest <span className="text-brand-primary">News</span>
        </h2>

        {hasNews ? (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {news.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 block group overflow-hidden"
                >
                  {item.bannerUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={item.bannerUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brand-primary mb-2 group-hover:text-[#ff4e50] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(item.date || item.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-6">
                      {item.content ||
                        "Read the latest updates from Koseli Colorado community and events."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All News Button */}
            <div className="text-center mt-12">
              <Link
                href="/news"
                className="inline-block px-8 py-3 rounded-full font-semibold border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition"
              >
                View All News
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            No news published yet. Stay tuned!
          </p>
        )}
      </div>
    </section>
  );
}
