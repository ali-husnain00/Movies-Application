"use client";

import { useState, useEffect } from "react";
import CustomSidebar from "@/components/app-sidebar";
import MovieSlider from "@/components/slider";
import Navbar from "@/components/navbar";
import MovieSection from "@/components/moviesSection";
import MovieCard from "@/components/movieCard";
import { Star, Flame, Eye, Film } from "lucide-react";
import Loading from "./loading";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const top = await fetch("/api/movies?category=top_rated").then((r) =>
          r.json()
        );
        const trend = await fetch("/api/movies?category=trending").then((r) =>
          r.json()
        );
        const pop = await fetch("/api/movies?category=popular").then((r) =>
          r.json()
        );

        setTopRated(top.results?.slice(0, 10) || []);
        setTrending(trend.results?.slice(0, 10) || []);
        setPopular(pop.results?.slice(0, 10) || []);
        setAllMovies(pop.results?.slice(0, 12) || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="flex bg-[#101114] min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <CustomSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <main
        className={`flex flex-col flex-1 transition-all duration-300 min-w-0 ${
          isOpen && window.innerWidth >= 1024 ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuClick={() => setIsOpen(!isOpen)} />

        {/* Content */}
        <div className="flex flex-col w-full overflow-x-hidden">
          <div className="w-full">
            <MovieSlider />
          </div>

          <div className="flex flex-col gap-3 md:gap-6 py-6">
            <MovieSection
              title="Top Rated"
              movies={topRated}
              icon={<Star className="w-6 h-6 text-yellow-400 mr-2" />}
            />
            <MovieSection
              title="Trending Now"
              movies={trending}
              icon={<Flame className="w-6 h-6 text-red-500 mr-2" />}
            />
            <MovieSection
              title="Popular Movies"
              movies={popular}
              icon={<Eye className="w-6 h-6 text-blue-400 mr-2" />}
            />
          </div>

          <div className="flex flex-col gap-4 mt-5 px-4 mb-10">
            <h2 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
              <Film className="w-6 h-6 text-purple-400" /> All Movies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {allMovies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
