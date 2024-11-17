const Filters = () => (
  <aside className="w-64 p-4 bg-[#0a1128] text-[#d1d9e6] rounded-lg shadow-md fixed left-0 top-16 h-full hidden lg:block">
    <h2 className="text-xl font-semibold mb-4 text-[#1a75ff]">Filters</h2>
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Genres</h3>
      <ul className="space-y-2">
        {/* Dynamically render genre checkboxes */}
        <li>
          <input type="checkbox" className="mr-2" /> Action
        </li>
        <li>
          <input type="checkbox" className="mr-2" /> Drama
        </li>
        <li>
          <input type="checkbox" className="mr-2" /> Comedy
        </li>
      </ul>
    </div>
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Sort By</h3>
      <select className="w-full bg-[#1a2b48] border border-gray-600 rounded p-2">
        <option>Popularity</option>
        <option>Rating</option>
        <option>Release Date</option>
      </select>
    </div>
  </aside>
);

export default Filters;
