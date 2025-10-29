import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

//  Helper to fetch single news item
async function getNews(slug) {
  return await prisma.news.findUnique({ where: { slug } });
}

//  SEO Metadata (handles Next.js 15 async params)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return { title: "News not found | Koseli Colorado" };

  return {
    title: `${news.title} | Koseli Colorado`,
    description: news.content?.slice(0, 150) || "Koseli Colorado news update",
    openGraph: {
      title: news.title,
      description: news.content?.slice(0, 150) || "",
      images: news.bannerUrl ? [news.bannerUrl] : [],
    },
  };
}

//  Main component
export default async function NewsDetailPage({ params }) {
  const { slug } = await params; 
  const news = await getNews(slug);
  if (!news) return notFound();

  const date = new Date(news.date || news.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
       {/* Hero Banner */}
      {news.bannerUrl && (
        <section className="relative w-full bg-black flex justify-center overflow-hidden">
          <Image
            src={news.bannerUrl}
            alt={news.title}
            width={1200}
            height={800}
            className="w-auto h-auto max-h-[90vh] object-contain mx-auto"
            priority
          />
        </section>
      )}

      {/*  Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {news.title}
          </h1>
          <p className="text-gray-400 text-lg">{date}</p>
        </div>

        {/* Divider */}
        <div className="w-24 h-[3px] bg-brand-primary mx-auto my-8 rounded-full"></div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {news.content}
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 italic">
            Stay tuned for more Koseli Colorado updates!
          </p>
        </div>
      </section>
    </article>
  );
}
