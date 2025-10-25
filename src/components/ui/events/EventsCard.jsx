"use client";
import Image from "next/image";
import Link from "next/link";

export default function EventsCard({ event, isPast }) {
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();

  return (
    <Link
      href={`/events/${event.slug}`} // ✅ make the card clickable by slug
      className={`flex flex-col md:flex-row overflow-hidden rounded-xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl ${
        isPast ? "bg-[#131217] text-gray-300" : "bg-white text-black"
      }`}
    >
      {/* Image */}
      {event.bannerUrl && (
        <div className="relative w-full md:w-1/3 h-64 md:h-auto flex items-center justify-center bg-black">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            loading="lazy"
            className="object-cover"
            style={{ objectPosition: "center" }}
            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div
              className={`text-center px-3 py-2 rounded-md ${
                isPast ? "bg-gray-700 text-white" : "bg-brand-primary text-white"
              }`}
            >
              <div className="text-lg font-bold leading-none">{day}</div>
              <div className="text-sm uppercase">{month}</div>
            </div>
            <p className={`text-sm ${isPast ? "text-gray-400" : "text-gray-600"}`}>
              POSTED DATE: {event.date.split("T")[0]}
            </p>
          </div>

          <h2
            className={`text-3xl font-extrabold mb-3 ${
              isPast ? "text-gray-200" : "text-brand-primary"
            }`}
          >
            {event.title}
          </h2>
          {event.location && (
            <p
              className={`text-sm mb-2 ${
                isPast ? "text-gray-400" : "text-gray-700"
              }`}
            >
              📍 {event.location}
            </p>
          )}
          <p
            className={`text-base leading-relaxed mb-4 ${
              isPast ? "text-gray-400" : "text-gray-700"
            }`}
          >
            {event.description?.slice(0, 200)}{/* Short preview */}
          </p>
        </div>

        {isPast ? (
          <p className="text-red-500 font-semibold text-right">
            Event already completed
          </p>
        ) : (
          <p className="text-green-600 font-semibold text-right">
            Upcoming Event
          </p>
        )}
      </div>
    </Link>
  );
}
