import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NewsStore } from "../types/news";

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      filters: {
        search: "",
        categories: ["Business"],
        authors: [],
        fromDate: "",
        toDate: "",
      },
      sources: [
        { id: "newsapi", name: "NewsAPI", enabled: true },
        { id: "guardian", name: "The Guardian", enabled: true },
        { id: "nyt", name: "The New York Times", enabled: true },
      ],
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      toggleSource: (sourceId) =>
        set((state) => ({
          sources: state.sources.map((source) =>
            source.id === sourceId
              ? { ...source, enabled: !source.enabled }
              : source
          ),
        })),
    }),
    {
      name: "news-preferences-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        filters: state.filters,
        sources: state.sources,
      }),
    }
  )
);
