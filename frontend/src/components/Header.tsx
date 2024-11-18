import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const isScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", isScroll);
  }, []);

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];

  const buttons = [
    { label: "Movie Recommender", path: "/recommender" },
    { label: "News", path: "/news" },
    { label: "Cinecritic.AI", path: "/cinecritic" },
  ];

  return (
    <div
      className={`flex items-center px-3 py-4 fixed w-full top-0 z-20 text-[#d1d9e6] transition-colors duration-300 ${
        isScrolled ? "bg-background opacity-100 shadow-lg" : "bg-transparent"
      }`}
    >
      <Link
        to="/"
        className="text-3xl font-semibold text-blue-light font-sans ml-8 mr-6"
      >
        Cineberg
      </Link>

      {buttons.map((button, index) => (
        <Link
          to={button.path}
          key={index}
          className="mx-3 text-sm hover:text-gray-light hover:underline transition-colors duration-200"
        >
          {button.label}
        </Link>
      ))}
    </div>
  );
};

export default Header;
