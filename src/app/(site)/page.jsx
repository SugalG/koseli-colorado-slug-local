import HeroSection from "@/components/ui/HeroSection";
import UpcomingEventsSection from "@/components/ui/UpcomingEventSection";
import PastEventSection from "@/components/ui/PastEventSection";
import WhatWeOfferSection from "@/components/ui/WhatWeOfferSection";
import NewsSection from "@/components/ui/NewsSection";
import SubscribeForm from "@/components/ui/SubscribeForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  let allEvents = [];
  let allNews = [];

  try {
    const [eventsRes, newsRes] = await Promise.all([
      fetch(`${base}/api/events`, { cache: "no-store" }),
      fetch(`${base}/api/news`, { cache: "no-store" }),
    ]);

    // ✅ Handle both { events: [...] } and plain array [] responses
    if (eventsRes.ok) {
      const data = await eventsRes.json();
      allEvents = Array.isArray(data?.events)
        ? data.events
        : Array.isArray(data)
          ? data
          : [];
    }

    if (newsRes.ok) {
      const data = await newsRes.json();
      allNews = Array.isArray(data?.news)
        ? data.news
        : Array.isArray(data)
          ? data
          : [];
    }
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  // ✅ Fallback for demo
  if (allEvents.length === 0) {
    allEvents = [
      {
        id: "demo-event",
        title: "Upcoming Nepali Music Festival",
        description:
          "Experience the rhythm and energy of Nepali music live in Colorado!",
        date: new Date().toISOString(),
        location: "Denver, CO",
        bannerUrl: "/placeholder.jpg", // ✅ replaced missing image
        isFeatured: true,
      },
    ];
  }

  const today = new Date();
  const featured = allEvents.filter((e) => e.isFeatured === true);
  const upcoming = allEvents.filter((e) => new Date(e.date) >= today);
  const past = allEvents.filter((e) => new Date(e.date) < today);

  return (
    <main className="min-h-screen bg-transparent text-white">
      {/* Hero Section */}
      <HeroSection featured={featured} />

      {/* Subtle divider */}
      <div className="h-2 sm:h-3 lg:h-4 bg-gradient-to-b from-transparent to-gray-50" />

      {/* Upcoming Events */}
      <section className="relative z-10 bg-gray-50 text-gray-900 py-8 md:py-10 lg:py-12">
        <UpcomingEventsSection upcoming={upcoming} />

        
        <div className="h-8" />

        <PastEventSection past={past} />
      </section>

      <div className="h-2 sm:h-3 lg:h-4 bg-gradient-to-b from-gray-100 to-white" />

      {/* What We Offer */}
      <section className="bg-white text-gray-900 py-8 md:py-10 lg:py-12">
        <WhatWeOfferSection />
      </section>

      {/* News Section */}
      <section className="bg-gray-50 text-gray-900 py-8 md:py-10 lg:py-12">
        <NewsSection news={allNews} />
      </section>

      {/* Newsletter */}
      <section className="bg-brand-primary/95 text-center py-14 md:py-16 text-white">
        <h3 className="text-3xl font-bold mb-5">
          Stay Connected with Koseli Colorado
        </h3>
        <p className="text-white/80 mb-6">
          Get updates on upcoming concerts, cultural nights, and community
          events.
        </p>
        <SubscribeForm />
      </section>
    </main>
  );
}
