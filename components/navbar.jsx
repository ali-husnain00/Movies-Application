"use client";

import { useState } from "react";
import { X, Menu, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar({ onMenuClick }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?query=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const clearSearch = () => setQuery("");

  return (
    <nav className="fixed top-0 left-0 w-full z-40 md:z-50 bg-transparent border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center w-full md:w-auto gap-3">
          <button className="text-white" onClick={onMenuClick}>
            <Menu size={26} />
          </button>

          <div className="text-white font-bold text-xl">Movies App</div>
        </div>

        {/* Links */}
        <ul className="hidden lg:flex lg:min-w-max gap-8 text-neutral-300 font-medium">
          <Link href="/">
            {" "}
            <li className="hover:text-white transition cursor-pointer">Home</li>
          </Link>
          <Link href="/movies">
            {" "}
            <li className="hover:text-white transition cursor-pointer">
              Movies
            </li>
          </Link>
          <Link href="/tvshows">
          <li className="hover:text-white transition cursor-pointer">
            TV Shows
          </li>
          </Link>
          <Link href="/top-rated">
          <li className="hover:text-white transition cursor-pointer">
            Top Rated
          </li>
          </Link>
        </ul>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search movies or TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-full text-white bg-white/10 border border-white/20 backdrop-blur-md placeholder-neutral-400 outline-none transition focus:ring-2 focus:ring-red-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
