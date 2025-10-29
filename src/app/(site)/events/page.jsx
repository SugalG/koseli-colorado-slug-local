"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import EventsHeader from "@/components/ui/events/EventsHeader";
import EventsSearchBar from "@/components/ui/events/EventsSearchBar";
import EventsList from "@/components/ui/events/EventsList";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 6;

  const observerRef = useRef(null);
  const initialized = useRef(false);

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  const loadEvents = useCallback(
    async (initial = false) => {
      try {
        if (initial) {
          setLoading(true);
          setSkip(0);
        } else {
          setLoadingMore(true);
        }

        const res = await fetch(
          `${base}/api/events?skip=${initial ? 0 : skip}&take=${take}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data.events)) {
          setEvents((prev) =>
            initial ? data.events : [...prev, ...data.events]
          );
          setHasMore(data.hasMore);
          setSkip((prev) => prev + take);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [base, skip]
  );

  // ✅ Always re-run on page visit to ensure fresh load
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadEvents(true);
    }
  }, [loadEvents]);

  // ✅ Infinite scroll observer (auto-load)
  useEffect(() => {
    if (loading || loadingMore) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadEvents(false);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadingMore, loadEvents]);

  const today = new Date();

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      <EventsHeader />

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-8">
        <EventsSearchBar search={search} setSearch={setSearch} />
      </div>

      <section className="container max-w-6xl mx-auto px-6 py-24 sm:py-20">
        {loading ? (
          <p className="text-center text-gray-400">Loading events...</p>
        ) : (
          <>
            <EventsList events={filtered} today={today} />

            {loadingMore && (
              <p className="text-center text-gray-400 mt-6">Loading more...</p>
            )}

            {hasMore && <div ref={observerRef} className="h-16" />}
          </>
        )}
      </section>
    </main>
  );
}
