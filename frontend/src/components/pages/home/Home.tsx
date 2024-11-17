import { useState, useEffect } from "react";
import { MovieInfo, MoviesState } from "../../../types/types";
import MovieCard from "../../movieInfo/MovieCard";

const Homepage = () => {
  const [movies, setMovies] = useState<MoviesState>({
    trending: [],
    nowplaying: [],
    upcoming: [],
  });
  const [randomMovie, setRandomMovie] = useState<MovieInfo>();

  const fetchMovies = (endpointUrl: string, state: string) => {
    const api_key = process.env.REACT_APP_TMDB_KEY;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + api_key,
        },
      };
      fetch(endpointUrl, options)
        .then((response) => response.json())
        .then((data) => {
          setMovies((prevState) => ({ ...prevState, [state]: data.results }));
        })
        .catch((error) => `uh oh spaghetti o's!!! ${error}`);
    } catch (error) {
      console.error(`uh oh spaghetti o's!!! ${error}`);
    }
  };

  const grabRandomMovie = (moviesArray: any[]) => {
    const randomIndex = Math.floor(Math.random() * moviesArray.length);
    return moviesArray[randomIndex];
  };

  useEffect(() => {
    fetchMovies(
      "https://api.themoviedb.org/3/trending/movie/week?language=en-US",
      "trending"
    );
    fetchMovies(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
      "nowplaying"
    );
    fetchMovies(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      "upcoming"
    );
  }, []);

  useEffect(() => {
    return setRandomMovie(grabRandomMovie(movies.trending));
  }, [movies.trending]);

  return (
    <>
      {randomMovie ? (
        <div className="relative h-screen">
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
            alt={randomMovie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-[#141414]" />

          <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 space-y-6">
            <h1 className="text-white text-5xl font-bold">
              {randomMovie.title}
            </h1>
            <div className="flex space-x-4">
              <button className="bg-gray-800 text-blue-light px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                More Info
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Could not load movie</div>
      )}
      {/* {randomMovie ? (
        <div>
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
            alt={randomMovie.title}
          />
          <h1>{randomMovie.title}</h1>
        </div>
      ) : (
        <div>Could not load movie</div>
      )} */}
      {["Trending", "Now Playing", "Upcoming"].map((subtitle) => {
        const typeKey = subtitle
          .toLowerCase()
          .replace(/\s+/g, "") as keyof MoviesState;
        return (
          <div
            key={subtitle}
            className={`${
              subtitle === "Trending"
                ? "-mt-40 relative z-10 pl-5 text-left"
                : "pl-5 text-left"
            }`}
          >
            <h2 className="text-white text-2xl font-semibold -mb-2 tracking-wide pl-5">
              {subtitle} Movies:
            </h2>
            <div className="pt-5 pb-5 pl-5 flex space-x-4 overflow-x-auto scrollbar-hide">
              {movies[typeKey] && movies[typeKey].length > 0 ? (
                movies[typeKey].map((movie) => (
                  <div key={movie.id}>
                    <MovieCard movie={movie} />
                  </div>
                ))
              ) : (
                <div>Could not load image</div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Homepage;
