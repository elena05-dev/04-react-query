import { useState, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "../ReactPaginate/ReactPaginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import type { FetchMoviesResponse } from "../../services/movieService";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } =
    useQuery<FetchMoviesResponse>({
      queryKey: ["movies", searchQuery, page],
      queryFn: () => fetchMovies(searchQuery, page),
      enabled: searchQuery !== "",
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    if (data && data.results.length === 0 && !isFetching) {
      toast.error("No movies found for your request.");
    }
  }, [data, isFetching]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setSearchQuery(query);
    setPage(1);
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && !isFetching && <Loader />}{" "}
      {data && (
        <>
          <ReactPaginate
            totalPages={data.total_pages}
            currentPage={page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
