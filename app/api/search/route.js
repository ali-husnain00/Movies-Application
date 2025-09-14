import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const res = await fetch(
      `${process.env.BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );

    const data = await res.json();

    const filteredResults = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );

    return NextResponse.json({ results: filteredResults });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ results: [] });
  }
}
