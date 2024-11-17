import { FaSearch, FaHome, FaHeart, FaFilm } from "react-icons/fa";

const Header = () => (
  <nav className="flex items-center justify-between px-8 py-4 bg-[#0a1128] text-[#d1d9e6] shadow-lg fixed w-full top-0 z-10">
    <div className="text-2xl font-semibold text-[#1a75ff]">Cineberg</div>
    <div className="flex items-center bg-[#1a2b48] rounded-full px-4 py-2">
      <FaSearch className="mr-2 text-gray-400" />
      <input
        type="text"
        placeholder="Search movies..."
        className="bg-transparent outline-none text-[#d1d9e6] w-60"
      />
    </div>
    <div className="flex gap-6 text-lg">
      <button className="hover:text-[#1a75ff]">
        <FaHome />
      </button>
      <button className="hover:text-[#1a75ff]">
        <FaFilm />
      </button>
      <button className="hover:text-[#1a75ff]">
        <FaHeart />
      </button>
    </div>
  </nav>
);

export default Header;
