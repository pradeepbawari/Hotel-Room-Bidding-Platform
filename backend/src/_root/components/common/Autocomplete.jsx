import React, { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Autocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      // const response = await axios.get(`https://dummyjson.com/products/search?q=${searchTerm}`);
      const response = await axios.get(`https://engine.hotellook.com/api/v2/lookup.json?query=london&lang=en&lookFor=both&limit=1&token=PasteYourTokenHere`);
      setSuggestions(response.data.results.hotels);
      localStorage.setItem('hotels', JSON.stringify(response.data.results.hotels))
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 2000), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetchSuggestions(value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion.locationName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
