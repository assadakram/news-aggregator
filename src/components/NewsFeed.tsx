import { useState, useEffect, useMemo } from "react";
import { ArticleCard } from "./ArticleCard";
import { useNewsStore } from "../store/useNewsStore";
import {
  fetchNewsApiArticles,
  fetchGuardianArticles,
  fetchNYTArticles,
} from "../services/api/newsApi";
import { Loader } from "lucide-react";
import { Article } from "../types/news";

export const NewsFeed: React.FC = () => {
  const { filters, sources } = useNewsStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const payload = useMemo(
    () => ({
      q: filters.search || undefined, // If no search query, use undefined
      category: filters.categories.length
        ? filters.categories.join(",")
        : undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      authors: filters.authors.length ? filters.authors.join(",") : undefined,
    }),
    [
      filters.search,
      filters.categories,
      filters.fromDate,
      filters.toDate,
      filters.authors,
    ]
  );

  const enabledSources = useMemo(
    () => sources.filter((s) => s.enabled),
    [sources]
  );

  useEffect(() => {
    // If no search query but user has selected categories, authors, or sources, fetch personalized feed
    if (
      !filters.search &&
      filters.categories.length === 0 &&
      filters.authors.length === 0 &&
      !filters.fromDate
    ) {
      setArticles([]); // Clear articles if no filters are set
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const promises = enabledSources.map((source) => {
          switch (source.id) {
            case "newsapi":
              return fetchNewsApiArticles(payload);
            case "guardian":
              return fetchGuardianArticles(payload);
            case "nyt":
              return fetchNYTArticles(payload);
            default:
              return Promise.resolve([]);
          }
        });

        const results = await Promise.all(promises);
        const allArticles = results.flat();

        console.log("Fetched articles:", allArticles); // Log fetched data

        setArticles(
          allArticles.sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters, enabledSources, payload]);

  if (
    !filters.search &&
    filters.categories.length === 0 &&
    filters.authors.length === 0
  ) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          Your personalized news feed is empty.
        </h2>
        <p className="text-gray-500">
          Select categories, sources, or authors to see relevant articles.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No articles found. Try adjusting your filters.
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
