export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const API_KEY = process.env.TMDB_API_KEY;

  let url = "";

  switch (category) {
    case "top_rated":
      url = `${process.env.BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
      break;
    case "trending":
      url = `${process.env.BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`;
      break;
    case "popular":
    default:
      url = `${process.env.BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      break;
  }

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return new Response("Failed to fetch movies", { status: 500 });
  }

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
