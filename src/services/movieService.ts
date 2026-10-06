import type { Movie } from "../types/movie";
import axios from "axios";

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MovieHttpResponse> => {
  const response = await axios.get<MovieHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  console.log("Fetched movies:", response.data);
  return response.data;
};
