import axios from "axios";
import { Article } from "../../types/news";
import toast from "react-hot-toast";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

const newsApiClient = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: { apiKey: NEWS_API_KEY },
});
const guardianClient = axios.create({
  baseURL: "https://content.guardianapis.com",
  params: {
    "api-key": GUARDIAN_API_KEY,
    "show-fields": "thumbnail,trailText,byline",
  },
});

const nytClient = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
  params: { "api-key": NYT_API_KEY },
});

type Payload = {
  q?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
  authors?: string;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data.message || "Something went wrong!";
  }
  return error instanceof Error ? error.message : "Unknown error occurred.";
};

export const fetchNewsApiArticles = async ({
  q,
  category,
  fromDate,
  toDate,
}: Payload): Promise<Article[]> => {
  try {
    let response;

    if (q && (fromDate || toDate)) {
      response = await newsApiClient.get("/everything", {
        params: {
          q,
          from: fromDate || undefined,
          to: toDate || undefined,
          sortBy: "publishedAt",
        },
      });
    } else {
      response = await newsApiClient.get("/top-headlines", {
        params: {
          category,
          q: q || "",
          sortBy: "publishedAt",
        },
      });
    }

    let articles = response.data.articles.map(
      (article: {
        url: string;
        title: string;
        description: string;
        urlToImage: string;
        publishedAt: string;
        source: { name: string };
        author: string;
      }) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name,
        category,
        author: article.author,
      })
    );

    if (fromDate || toDate) {
      const fromTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
      const toTimestamp = toDate ? new Date(toDate).getTime() : Infinity;

      articles = articles.filter((article: Article) => {
        const publishedAt: number = new Date(article.publishedAt).getTime();
        return publishedAt >= fromTimestamp && publishedAt <= toTimestamp;
      });
    }

    return articles;
  } catch (error) {
    toast.error(getErrorMessage(error));
    return [];
  }
};

export const fetchGuardianArticles = async ({
  q,
  category,
  fromDate,
  toDate,
}: Payload): Promise<Article[]> => {
  try {
    const response = await guardianClient.get("/search", {
      params: {
        q,
        section: category || undefined,
        "from-date": fromDate || undefined,
        "to-date": toDate || undefined,
        orderBy: "newest",
      },
    });

    return response.data.response.results.map(
      (article: {
        id: string;
        webTitle: string;
        fields?: { trailText?: string; thumbnail?: string; byline?: string };
        webUrl: string;
        webPublicationDate: string;
      }) => ({
        id: article.id,
        title: article.webTitle,
        description: article.fields?.trailText || "",
        url: article.webUrl,
        imageUrl: article.fields?.thumbnail,
        publishedAt: article.webPublicationDate,
        source: "The Guardian",
        category: category || undefined,
        author: article.fields?.byline,
      })
    );
  } catch (error) {
    toast.error(getErrorMessage(error));
    return [];
  }
};

export const fetchNYTArticles = async ({
  q,
  category,
  fromDate,
  toDate,
  authors,
}: Payload): Promise<Article[]> => {
  try {
    const formattedCategory = category ? `section_name:("${category}")` : "";
    const formattedAuthors = authors ? `byline:("${authors}")` : "";

    const response = await nytClient.get("/articlesearch.json", {
      params: {
        q,
        fq: `${formattedCategory} ${formattedAuthors}`.trim(),
        begin_date: fromDate ? fromDate.replace(/-/g, "") : undefined, // Convert YYYY-MM-DD to YYYYMMDD
        end_date: toDate ? toDate.replace(/-/g, "") : undefined, // Convert YYYY-MM-DD to YYYYMMDD
        sort: "newest",
      },
    });

    return response.data.response.docs.map(
      (article: {
        _id: string;
        headline: { main: string };
        abstract: string;
        web_url: string;
        multimedia: { url: string }[];
        pub_date: string;
        byline: { original: string };
      }) => ({
        id: article._id,
        title: article.headline.main,
        description: article.abstract,
        url: article.web_url,
        imageUrl: article.multimedia?.length
          ? `https://www.nytimes.com/${article.multimedia[0].url}`
          : undefined,
        publishedAt: article.pub_date,
        source: "The New York Times",
        category: category || undefined,
        author: article.byline?.original,
      })
    );
  } catch (error) {
    toast.error(getErrorMessage(error));
    return [];
  }
};
