"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Calendar, Clock, User, Play } from "lucide-react";
import Loading from "@/app/loading";

export default function StreamingPage() {
  const params = useParams();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [playVideo, setPlayVideo] = useState(false); // control when iframe shows

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [detailsRes, videosRes, creditsRes] = await Promise.all([
          fetch(`/api/movies/${id}`),
          fetch(`/api/movies/${id}/videos`),
          fetch(`/api/movies/${id}/credits`),
        ]);

        const details = await detailsRes.json();
        const videos = await videosRes.json();
        const credits = await creditsRes.json();

        setMovie(details);
        setCast(credits.cast.slice(0, 5));
        const trailerVideo = videos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(trailerVideo);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovieData();
  }, [id]);

  if (!movie || !trailer) return <Loading />;

  return (
    <div className="bg-neutral-900 text-white min-h-screen px-4 md:px-12 py-8">
      <div className="flex flex-col lg:flex-row lg:h-screen gap-8 lg:gap-12">
        {/* Left: Video / Play overlay */}
        <div className="lg:w-1/2 w-full h-80 lg:h-full relative rounded-xl overflow-hidden shadow-2xl flex justify-center items-center">
          {playVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&modestbranding=1&rel=0&enablejsapi=1`}
              title="Movie Trailer"
              allow="autoplay; fullscreen"
              className="w-full h-full rounded-xl"
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer flex justify-center items-center"
              onClick={() => setPlayVideo(true)}
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <Play className="w-20 h-20 text-white drop-shadow-lg animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Movie Info */}
        <div className="lg:w-1/2 w-full flex flex-col gap-4 justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold">{movie.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-yellow-400 text-lg md:text-xl">
            <span className="flex items-center gap-1">
              <Star className="w-5 h-5" /> {movie.vote_average.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-5 h-5" />{" "}
              {movie.release_date?.split("-")[0]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-5 h-5" /> {movie.runtime} min
            </span>
            <span className="flex items-center gap-1">
              <User className="w-5 h-5" /> {cast.length} Actors
            </span>
          </div>

          <p className="text-neutral-300">
            {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p className="mt-2 text-neutral-300">{movie.overview}</p>

          {/* Top Cast */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Top Cast</h2>
            <div className="flex gap-4 flex-wrap">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex-shrink-0 w-24 text-center transition-transform transform hover:scale-105"
                >
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <p className="mt-1 text-sm font-medium">{actor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
