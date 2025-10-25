import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// 🧩 Helper
async function getEvent(slug) {
  return await prisma.event.findUnique({
    where: { slug },
  });
}

// 🧠 SEO Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found | Koseli Colorado" };

  return {
    title: `${event.title} | Koseli Colorado`,
    description: event.description?.slice(0, 150) || "Koseli Colorado event",
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.bannerUrl ? [event.bannerUrl] : [],
    },
  };
}

// 🟢 Main Component
export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return notFound();

  const date = new Date(event.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full max-h-[90vh] flex justify-center bg-black">
          <Image
            src={event.bannerUrl || "/placeholder.jpg"}
            alt={event.title}
            width={1200}
            height={800}
            className="w-auto h-auto max-h-[90vh] object-contain mx-auto"
            priority
          />
        </div>

        {/* Overlay Text */}
        <div className="relative w-full bg-gradient-to-b from-gray-900/90 to-black text-center py-10 px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {event.title}
          </h1>
          <p className="text-gray-300 text-lg">{date}</p>
          {event.location && (
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              📍 {event.location}
            </p>
          )}
        </div>
      </section>

      {/* Event Details */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-200">
        {/* <p className="text-lg leading-relaxed whitespace-pre-line">
          {event.description}
        </p> */}

        <div className="w-24 h-[3px] bg-brand-primary mx-auto my-12 rounded-full"></div>

        <p className="text-center text-gray-400 italic">
          Stay tuned for more Koseli Colorado events and updates!
        </p>
      </section>
    </article>
  );
}
