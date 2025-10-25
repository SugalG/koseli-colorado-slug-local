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

    if (eventsRes.ok) {
      const data = await eventsRes.json();
      allEvents = Array.isArray(data) ? data : [];
    }

    if (newsRes.ok) {
      const data = await newsRes.json();
      allNews = Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("HomePage fetch error:", err);
  }

  // fallback for demo
  if (allEvents.length === 0) {
    allEvents = [
      {
        id: "demo-event",
        title: "Upcoming Nepali Music Festival",
        description:
          "Experience the rhythm and energy of Nepali music live in Colorado!",
        date: new Date().toISOString(),
        location: "Denver, CO",
        bannerUrl: "/demo/hero-fallback.jpg",
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
      {/* 🔹 Hero Section */}
      <HeroSection featured={featured} />

      <div className="h-8 bg-gradient-to-b from-transparent to-gray-50" />

      {/* 🔹 Upcoming Events */}
      <section className="relative z-10 bg-gray-50 text-gray-900">
        <UpcomingEventsSection upcoming={upcoming} />
      </section>

      <div className="h-8 bg-gradient-to-b from-gray-50 to-gray-100" />

      {/* 🔹 Past Events */}
      <section className="relative z-10 bg-gray-100 text-gray-900">
        <PastEventSection past={past} />
      </section>

      <div className="h-8 bg-gradient-to-b from-gray-100 to-white" />

      {/* 🔹 What We Offer */}
      <WhatWeOfferSection />

      {/* 🔹 News Section */}
      
      <NewsSection news={allNews} />

      {/* 🔹 Newsletter */}
      <section className="bg-brand-primary/95 text-center py-20 text-white">
        <h3 className="text-3xl font-bold mb-6">
          Stay Connected with Koseli Colorado
        </h3>
        <p className="text-white/80 mb-8">
          Get updates on upcoming concerts, cultural nights, and community
          events.
        </p>
        <SubscribeForm />
      </section>
    </main>
  );
}
