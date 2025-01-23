import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkFetchSearchResults } from "../../redux/search";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Trigger the search when form is submitted
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Dispatch the search action
      dispatch(thunkFetchSearchResults(query));
      // Navigate to the search results page with the query in the URL
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for recipes, collections, or users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={!query.trim()}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
