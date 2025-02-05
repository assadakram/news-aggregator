import React from 'react';
import { Article } from '../types/news';
import { Calendar, User, Newspaper } from 'lucide-react';
import { format } from 'date-fns';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4">{article.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {format(new Date(article.publishedAt), 'MMM d, yyyy')}
          </div>
          {article.author && (
            <div className="flex items-center gap-1">
              <User size={16} />
              {article.author}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Newspaper size={16} />
            {article.source}
          </div>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Read More
        </a>
      </div>
    </div>
  );
};