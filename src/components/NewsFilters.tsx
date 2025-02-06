import { AlertCircle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useNewsStore } from "../store/useNewsStore";

const categories = [
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
];

export const NewsFilters: React.FC = () => {
  const { filters, setFilters, sources, toggleSource } = useNewsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [showWarning, setShowWarning] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Ensures at least one source remains selected
  const handleToggleSource = (sourceId: string) => {
    const updatedSources = sources.map((source) =>
      source.id === sourceId ? { ...source, enabled: !source.enabled } : source
    );

    if (updatedSources.every((s) => !s.enabled)) {
      setShowWarning(true);

      setTimeout(() => setShowWarning(false), 2000);

      return;
    }

    setShowWarning(false);
    toggleSource(sourceId);
  };

  // Ensures only one category is selected at a time
  const handleCategorySelection = (category: string) => {
    setFilters({
      categories: filters.categories.includes(category) ? [] : [category],
    });
  };

  // Clear filters and reset sources to all selected
  const clearFilters = () => {
    setFilters({
      search: "",
      categories: ["Business"],
      fromDate: "",
      toDate: "",
    });
    sources.forEach((source) => {
      if (!source.enabled) toggleSource(source.id);
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Source Selection */}
      <h3 className="text-lg font-medium text-gray-700 mb-2">Sources</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {sources.map(({ id, name, enabled }) => (
          <button
            key={id}
            onClick={() => handleToggleSource(id)}
            className={`px-3 py-1 rounded-full text-sm ${
              enabled ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Warning Message for Source Selection */}
      {showWarning && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
          <AlertCircle size={16} /> At least one source must be selected.
        </div>
      )}

      {/* Category Selection (Single-Select Toggle Button) */}
      <h3 className="text-lg font-medium text-gray-700 mb-2">Category</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelection(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filters.categories.includes(category)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Date Range Selection */}
      <h3 className="text-lg font-medium text-gray-700 mb-2">Date Range</h3>
      <div className="flex flex-wrap gap-4 mb-4">
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

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Reset Filters
      </button>
    </div>
  );
};
