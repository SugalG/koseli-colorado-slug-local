"use client";
import Image from "next/image";
import Link from "next/link";

export default function PastEventSection({ past = [] }) {
  const hasPast = Array.isArray(past) && past.length > 0;

  // Sort past events by most recent (descending by date)
  const sortedPast = hasPast
    ? [...past].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <section className="relative bg-gray-100 py-12 md:py-16 px-6 md:px-10 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Past <span className="text-brand-primary">Events</span>
        </h2>

        {hasPast ? (
          <>
            {/* Event Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {sortedPast.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 block"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.bannerUrl || "/placeholder.jpg"}
                      alt={event.title}
                      fill
                      loading="lazy"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                    />
                  </div>

                  <div className="p-6 flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description ||
                        "A memorable event from the Koseli community."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Past Events */}
            <div className="text-center mt-12">
              <Link
                href="/events?filter=past"
                className="inline-block px-8 py-3 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                View All Events
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            No past events yet.
          </p>
        )}
      </div>
    </section>
  );
}
