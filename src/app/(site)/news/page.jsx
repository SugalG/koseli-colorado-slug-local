import NewsList from "@/components/ui/news/NewsList";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  const res = await fetch(`${base}/api/news`, { cache: "no-store" });
  const news = await res.json();

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      {/* 🔹 Header Section */}
      <section className="py-24 sm:py-20 text-center relative bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Latest News
        </h1>
        <div className="w-1 h-10 bg-brand-primary mx-auto mt-3 rounded"></div>
        <p className="text-gray-200 mt-4 text-base md:text-lg">
          Stay updated with the latest news and updates from Koseli Colorado.
        </p>
      </section>

      {/* 🔹 News List */}
      <section className="container max-w-6xl mx-auto px-6 py-24 sm:py-20">
        <NewsList news={news} />
      </section>
    </main>
  );
}
