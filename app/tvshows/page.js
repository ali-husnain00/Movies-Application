"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MovieCard from "@/components/movieCard"; // reuse or create TVShowCard if needed
import { ChevronLeft, ChevronRight, Tv, ArrowLeft } from "lucide-react";
import Loading from "../loading";
import TVShowCard from "@/components/tvShowCard";

const AllTvShowsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tv/page/${page}`); 
        const data = await res.json();
        setShows(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Failed to fetch TV shows", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
    router.push(`?page=${page}`);
  }, [page, router]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-4 md:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Heading + Page Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold">
          <Tv className="w-6 h-6 text-blue-500" />
          TV Shows
        </h1>
        <span className="text-gray-400 font-medium">
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {shows.length > 0 ? (
          shows.map((show) => <TVShowCard key={show.id} show={show} />)
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No TV shows available.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="px-3 sm:px-4 py-2 font-semibold text-sm sm:text-base">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AllTvShowsPage;
