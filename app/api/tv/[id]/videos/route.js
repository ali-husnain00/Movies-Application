const API_KEY = process.env.TMDB_API_KEY;

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: true, message: data.status_message }), { status: res.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: true, message: error.message }), { status: 500 });
  }
}
