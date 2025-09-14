"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Loading from "@/app/loading";

export default function TVShowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [tvShow, setTvShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        setLoading(true);
        const [detailsRes, creditsRes] = await Promise.all([
          fetch(`/api/tv/${id}`),
          fetch(`/api/tv/${id}/credits`),
        ]);

        const details = await detailsRes.json();
        const credits = await creditsRes.json();

        setTvShow(details);
        setCast(credits.cast.slice(0, 6)); // Top 6 cast
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowDetails();
  }, [id]);

  if (loading || !tvShow) return <Loading />;

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 sm:px-6 md:px-12 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 text-gray-200 hover:text-white transition"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Left: Poster */}
        <div className="relative w-full lg:w-2/5 h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.poster_path}`}
            alt={tvShow.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
            {tvShow.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-yellow-400 text-sm sm:text-base md:text-lg">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {tvShow.vote_average.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {tvShow.first_air_date?.split("-")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />{" "}
              {tvShow.episode_run_time?.[0] || "N/A"} min
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 sm:w-5 sm:h-5" /> {cast.length} Actors
            </span>
          </div>

          <p className="text-neutral-300 text-sm sm:text-base mt-1">
            {tvShow.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="mt-2 text-neutral-300 text-sm sm:text-base md:text-lg">
            {tvShow.overview.length > 200
              ? tvShow.overview.slice(0, 200) + "..."
              : tvShow.overview}
          </p>

          <button
            onClick={() => router.push(`/tvshows/${id}/watch`)}
            className="mt-4 w-max cursor-pointer bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-purple-500 hover:to-red-500 transition-all px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-2xl"
          >
            Watch Now
          </button>

          {/* Top Cast */}
          <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2">Top Cast</h2>
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
