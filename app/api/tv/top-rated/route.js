import { NextResponse } from "next/server";

export async function GET(req) {
  try {

    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    const res = await fetch(
      `${process.env.BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch top-rated TV shows");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ results: [], total_pages: 1 });
  }
}
