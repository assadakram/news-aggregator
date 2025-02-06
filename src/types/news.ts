interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
}

interface NewsFilters {
  search: string;
  startDate?: Date;
  endDate?: Date;
  fromDate?: string;
  toDate?: string;
  categories: string[];
  authors: string[];
}

export interface NewsStore {
  hydrated: boolean;
  filters: NewsFilters;
  sources: NewsSource[];
  setFilters: (filters: Partial<NewsFilters>) => void;
  toggleSource: (sourceId: string) => void;
  setHydrated: () => void;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: string;
  author?: string;
}

export interface ArticleCardProps {
  article: Article;
}
