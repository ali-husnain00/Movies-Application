// app/api/movie/[id]/videos/route.js
export async function GET(req, { params }) {
  const { id } = params;

  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
  if (!res.ok) return new Response("Failed to fetch movie videos", { status: 500 });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
