import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNewsStore } from "../store/useNewsStore";
import { useDebounce } from "../hooks/useDebounce";

const categories = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "science",
  "health",
];

export const NewsFilters: React.FC = () => {
  const { filters, setFilters, sources, toggleSource } = useNewsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {sources.map(({ id, name, enabled }) => (
            <button
              key={id}
              onClick={() => toggleSource(id)}
              className={`px-3 py-1 rounded-full text-sm ${
                enabled
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilters({ categories: [category] })}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.categories.includes(category)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            value={filters.fromDate || ""}
            onChange={(e) => setFilters({ fromDate: e.target.value })}
            className="pl-4 pr-4 py-2 border rounded-md"
          />
          <input
            type="date"
            value={filters.toDate || ""}
            onChange={(e) => setFilters({ toDate: e.target.value })}
            className="pl-4 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
