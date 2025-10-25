import NewsCard from "./NewsCard";

export default function NewsList({ news }) {
  if (!news?.length)
    return (
      <p className="text-gray-400 text-center">
        No news has been published yet.
      </p>
    );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
