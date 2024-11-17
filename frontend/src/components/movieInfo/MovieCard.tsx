import { MovieInfo } from "../../types/types";

const MovieCard = ({ movie }: { movie: MovieInfo }) => {
  return (
    <div
      className="cursor-pointer w-[14rem] h-[20rem] rounded-xl bg-cover bg-center flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 relative group"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-xl"></div>
      <div className="text-blue-light font-semibold font-montserrat opacity-0 group-hover:opacity-100 z-10 pl-6 pt-4 text-lg">
        <h3>{new Date(movie.release_date).getFullYear()}</h3>
      </div>
      <div className="flex-1 relative z-10"></div>
      <div className="bg-gray-800 group-hover:bg-opacity-0 rounded-b-xl text-left pt-4 pb-6 px-6 relative z-10">
        <h4 className="font-raleway tracking-wider font-medium text-xs text-[#b6b8b5]">
          {movie.media_type ? movie.media_type.toUpperCase() : "MOVIE"}
        </h4>
        <h3 className="m-0 mt-1 font-montserrat text-blue-light font-semibold break-words whitespace-normal">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export default MovieCard;
