import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import ReactPaginateModule from "react-paginate";
import type { ComponentType } from "react";
import type { ReactPaginateProps } from "react-paginate";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;
function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    console.log("Searching for movies with query:", newQuery);
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelectMovie = (film: Movie) => {
    setSelectedFilm(film);
    console.log("Обраний фільм:", film);
  };
  const movies = data?.results ?? [];
  useEffect(() => {
    if (data && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, movies.length]);

  return (
    <>
      <div className={styles.app}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {isLoading && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
        {data && data.total_pages > 1 && (
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
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
