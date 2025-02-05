import React from "react";
import { Article } from "../types/news";
import { Calendar, User, Newspaper } from "lucide-react";
import { format } from "date-fns";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col h-full">
      {/* Article Image */}
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-56 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-base line-clamp-3">
          {article.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 truncate">
          <div className="flex items-center gap-2 truncate">
            <Calendar size={16} />
            <span>{format(new Date(article.publishedAt), "MMM d, yyyy")}</span>
          </div>
          {article.author && (
            <div className="flex items-center gap-2 truncate">
              <User size={16} />
              <span className="truncate">{article.author}</span>
            </div>
          )}
          <div className="flex items-center gap-2 truncate">
            <Newspaper size={16} />
            <span className="truncate">{article.source}</span>
          </div>
        </div>

        {/* Read More Button - Always at the bottom */}
        <div className="mt-auto">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};
