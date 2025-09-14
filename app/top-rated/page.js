"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/movieCard";
import TVShowCard from "@/components/tvShowCard";
import { Star, ArrowLeft } from "lucide-react";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function TopRatedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const [moviesRes, tvRes] = await Promise.all([
          fetch("/api/movies/top-rated?page=1"),
          fetch("/api/tv/top-rated?page=1"),
        ]);

        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();

        const combined = [
          ...(moviesData.results || []),
          ...(tvData.results || []),
        ];

        // Sort by rating descending
        combined.sort((a, b) => b.vote_average - a.vote_average);

        setItems(combined.slice(0, 20)); // Only first 20 items
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

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
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 flex items-center gap-2 break-words">
        <Star className="w-10 h-10 text-yellow-400" />
        Top Rated Movies/TV Shows
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {items.map((item) =>
          item.title ? (
            <MovieCard key={`movie-${item.id}`} movie={item} />
          ) : (
            <TVShowCard key={`tv-${item.id}`} show={item} />
          )
        )}
      </div>
    </div>
  );
}
