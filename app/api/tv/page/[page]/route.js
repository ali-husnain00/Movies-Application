// pages/api/tv/page/[page].js
export async function GET(req, { params }) {
  const { page } = params;

  const res = await fetch(
    `${process.env.BASE_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`,
    { cache: "no-store" }
  );

  if (!res.ok) return new Response("Failed to fetch movies", { status: 500 });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
