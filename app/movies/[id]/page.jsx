"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Calendar, Clock, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsRes, creditsRes, videosRes] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch(`/api/movies/${id}/credits`),
          fetch(`/api/movies/${id}/videos`),
        ]);

        const details = await detailsRes.json();
        const credits = await creditsRes.json();
        const videos = await videosRes.json();

        setMovie(details);
        setCast(credits.cast.slice(0, 6));
        const trailerVideo = videos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(trailerVideo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <Loading />;

  return (
    <div className="bg-neutral-900 text-white px-4 sm:px-6 md:px-12 py-8 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Top Section: Banner + Details */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Left: Banner */}
        <div className="relative w-full lg:w-2/5 h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Right: Movie Details */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-yellow-400 text-sm sm:text-base md:text-lg">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {movie.release_date?.split("-")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> {movie.runtime} min
            </span>
          </div>

          <p className="text-neutral-300 text-sm sm:text-base mt-1">
            {movie.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="mt-2 text-neutral-300 text-sm sm:text-base md:text-lg">
            {movie.overview.length > 150
              ? movie.overview.slice(0, 150) + "..."
              : movie.overview}
          </p>

          {/* Watch Now Button */}
          {trailer && (
            <button
              onClick={() => router.push(`/movies/${id}/watch`)}
              className="mt-4 w-max cursor-pointer bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-purple-500 hover:to-red-500 transition-all px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl"
            >
              Watch Now
            </button>
          )}

          {/* Top Cast */}
          <h2 className="text-xl sm:text-2xl font-bold mt-4 mb-2">Top Cast</h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto py-2 scrollbar-none">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="flex-shrink-0 w-20 sm:w-24 text-center transition-transform transform hover:scale-105"
              >
                <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <p className="mt-1 text-xs sm:text-sm font-medium">
                  {actor.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
