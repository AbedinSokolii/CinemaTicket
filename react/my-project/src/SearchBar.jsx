import { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for movies..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
      {query ? (
        <button
          onClick={clearSearch}
          className="absolute right-10 top-2.5 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      ) : (
        <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
      )}
    </div>
  );
};

export default SearchBar;