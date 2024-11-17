export function Search() {
  return <div>Hello Search</div>;
}

// <>
// <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-lg">
//   <div className="text-3xl font-bold">Cineberg</div>
//   <div className="flex items-center space-x-4">
//     <input
//       type="text"
//       placeholder="Search movies..."
//       className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
//     />
//     <FaSearch className="text-gray-400" />
//   </div>
// </header>

// <main className="px-6 py-8">
//   {["Trending", "Now Playing", "Upcoming"].map((subtitle) => {
//     const typeKey = subtitle
//       .toLowerCase()
//       .replace(/\s+/g, "") as keyof MoviesState;
//     return (
//       <section key={subtitle} className="mb-12">
//         <h2 className="text-2xl font-semibold mb-4">
//           {subtitle} Movies:
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {movies[typeKey].map((movie) => (
//             <div
//               key={movie.id}
//               className="rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
//             >
//               <img
//                 src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                 alt={`${movie.title} Poster`}
//                 className="w-full h-auto object-cover"
//               />
//               <div className="bg-black bg-opacity-75 text-center py-2">
//                 <p className="font-semibold">{movie.title}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   })}
// </main>
// </>