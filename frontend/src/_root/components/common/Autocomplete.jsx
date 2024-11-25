import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const Autocomplete = ({
  value,
  onChange,
  onSelect,
  fetchSuggestions = () => {}, // Fallback to a no-op function
  suggestionsList = [],
  loading,
  placeholder = 'Search...',
  renderSuggestion = (suggestion) => suggestion,
  debounceDelay = 1000,
  inputClass = '',
  listClass = '',
  itemClass = '',
  loadingIcon = null,
  title = 'dummy'
}) => {
  const [query, setQuery] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, debounceDelay),
    [fetchSuggestions, debounceDelay]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    const label = `{${title} : "${value}"}`;
    let formattedStr = label.replace(/(\w+)\s*:/g, '"$1":');
    let obj = JSON.parse(formattedStr);
    setQuery(value);
    onChange?.(obj);
    debouncedFetchSuggestions({title: title, value: value});
    setShowSuggestions(true);
  };

  // address : "Jim Corbett National Park, Pawalgarh"
  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${inputClass}`}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}  
      />
      {loading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loadingIcon || (
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
        </div>
      )}
      
      {showSuggestions && suggestionsList && suggestionsList.length > 0 && (
        <ul
          className={`absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 ${listClass}`}
        >
          {suggestionsList.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${itemClass}`}
              onClick={() => {
                onSelect?.(suggestion);
                setQuery(renderSuggestion(suggestion));
                setShowSuggestions(false);
              }}
            >
              {renderSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
