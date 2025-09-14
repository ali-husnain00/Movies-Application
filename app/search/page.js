"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard from "@/components/movieCard";
import TVShowCard from "@/components/tvShowCard";
import Loading from "../loading";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        // Sort by rating descending
        const sorted = (data.results || []).sort(
          (a, b) => b.vote_average - a.vote_average
        );
        setResults(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query)
    return <p className="text-center mt-10 text-gray-400">No search query.</p>;
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-4 md:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition text-sm sm:text-base"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Heading */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 flex items-center gap-2 break-words">
        <SearchIcon className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
        Search results for &quot;{query}&quot;
      </h3>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {results.map((item) =>
            item.media_type === "movie" ? (
              <MovieCard key={`movie-${item.id}`} movie={item} />
            ) : (
              <TVShowCard key={`tv-${item.id}`} show={item} />
            )
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">No results found.</p>
      )}
    </div>
  );
}
