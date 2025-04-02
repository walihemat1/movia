import { useEffect, useState } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // Native Browser API
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          // callback?.();
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=77d7b228&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong!");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error);
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      // handleCloseMovie();

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },

    [query]
  );

  return { movies, isLoading, error };
}
