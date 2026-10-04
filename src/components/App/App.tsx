import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    console.log("Searching for movies with query:", query);

    setLoading(true);
    setError(false);
    setMovies([]);
    try {
      const movies = await fetchMovies(query);
      if (movies.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(movies);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectMovie = (film: Movie) => {
    setSelectedFilm(film);
    console.log("Обраний фільм:", film);
  };
  return (
    <>
      <div className={styles.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {loading && <Loader />}
        {!loading && error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
        {selectedFilm && (
          <MovieModal
            movie={selectedFilm}
            onClose={() => setSelectedFilm(null)}
          />
        )}
      </div>
    </>
  );
}
export default App;
