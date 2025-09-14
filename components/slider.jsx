"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MovieSlider() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const router = useRouter();

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Fetch trending movies from TMDb
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies?category=trending");
        const data = await res.json();
        setMovies(data.results?.slice(0, 10) || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Auto slide
  useEffect(() => {
    if (!movies.length) return;
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev + 1) % movies.length),
      4000
    );
    return () => resetTimeout();
  }, [current, movies]);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % movies.length);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          onClick={() => router.push(`/movies/${movie.id}`)}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 cursor-pointer ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority={index === current}
              sizes="100vw"
              className="object-cover"
              placeholder="blur"
              unoptimized={true}
              blurDataURL={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
            />
          </div>

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute bottom-6 right-6 text-right text-white max-w-[70%]">
            <h2 className="text-2xl md:text-3xl font-bold">{movie.title}</h2>
            <p className="text-sm md:text-base text-neutral-300">
              {movie.release_date?.split("-")[0]} • {movie.vote_average?.toFixed(1)}⭐
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 z-30"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 z-30"
      >
        <ChevronRight className="text-white" size={28} />
      </button>
    </div>
  );
}
