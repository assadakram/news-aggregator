import { Newspaper } from "lucide-react";
import { NewsFilters } from "./components/NewsFilters";
import { NewsFeed } from "./components/NewsFeed";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Newspaper className="text-blue-600 mr-3" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              News Aggregator
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative">
        <NewsFilters />
        <NewsFeed />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </main>
    </div>
  );
}

export default App;
