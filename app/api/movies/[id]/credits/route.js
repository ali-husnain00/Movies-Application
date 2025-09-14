// app/api/movie/[id]/credits/route.js
export async function GET(req, { params }) {
  const { id } = params;

  const res = await fetch(`${process.env.BASE_URL}/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
  if (!res.ok) return new Response("Failed to fetch movie credits", { status: 500 });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
}
