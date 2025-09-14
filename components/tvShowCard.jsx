"use client";

import { Star, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TVShowCard({ show }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/tvshows/${show.id}`)}
      className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer w-full max-w-[240px] flex-shrink-0"
    >
      {/* Image */}
      <div className="relative w-full h-50 sm:h-50 md:h-70">
        <Image
          src={
            show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : "/placeholder.png"
          }
          alt={show.name}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={
            show.poster_path
              ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
              : "/placeholder.png"
          }
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4 text-white flex flex-col gap-2">
        <h3 className="font-bold text-lg sm:text-xl line-clamp-2 break-words">
          {show.name}
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-neutral-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-yellow-400" />{" "}
            {show.first_air_date || "N/A"}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />{" "}
            {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
