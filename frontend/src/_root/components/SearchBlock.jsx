import React, { useEffect, useState, useCallback, useRef } from 'react';
import Autocomplete from './common/Autocomplete';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetStateToEmpty, searchHotel, searchLocation } from '../../redux/actions';

const SearchBlock = () => {
  const { hotelname } = useParams();
  const [hide, setHide] = useState('hidden');
  const [loading, setLoading] = useState(false);
  const [loadingHotel, setLoadingHotel] = useState(false);
  const [searchObj, setSearchObj] = useState({address: null, hotelName: null, type: null});
  const [searchBtn, setSearchBtn] = useState({address: null, hotelName: null, type: null, roomType: null, limit: 20});
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const searchList = useSelector((state) => state.searchLoc.searchLoc);
  const searchHotelList = useSelector((state) => state.searchHtl.searchHtl);
  const [emptyValue, setEmptyValue] = useState(true);
  const searchBtnRef = useRef(searchBtn);
  const urlLocal = localStorage.getItem('url');
  const [matchUrl, setMatchUrl] = useState(true);

  // Fetch suggestions for autocomplete
  const fetchSuggestions = useCallback(
    async (searchTerm) => {
      const obj = searchBtnRef.current;
      const {title, value} = searchTerm;
      if (searchTerm.value == '' || searchTerm.value == ' ') {
          dispatch(resetStateToEmpty('searchLoc'))
          dispatch(resetStateToEmpty('searchHtl'))
          // const updateObj = {...searchObj, [title]: null, hotelName: null}
          // setSearchObj(updateObj)
          // updateSearch(searchTerm)
          setEmptyValue(true)
        return;
      }
      
      title == 'address' ? setLoading(true) : setLoadingHotel(true);      
      try {
        // const updateObj = {...searchObj, [title]: value}
        // setSearchObj(updateObj)
        // setSearchBtn((prevState) => ({
        //   ...prevState,
        //   [title]: value,
        // }))
        // updateSearch(searchTerm)
        title == 'address' ? await dispatch(searchLocation(obj)) : await dispatch(searchHotel(obj));
        
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        title == 'address' ? setLoading(false) : setLoadingHotel(false);
      }
    },
    [dispatch, searchList, searchHotelList]
  );

  const updateSearch = (suggestion) => {
    const objKey = Object.keys(suggestion)
    const objValue = (suggestion[objKey] !== '' && suggestion[objKey] !== ' ' && suggestion[objKey] !== null ? Object.values(suggestion) : null)
    setSearchBtn((prevState) => ({
      ...prevState,
      [objKey]: objValue,
    }))
  } 

  // Handle selection of a suggestion
  const handleSelect = (suggestion) => {
    if(suggestion.type == '--Hotel Type--'){
      suggestion.type = null;
    }
    if(suggestion.roomType == '--Room Type--'){
      suggestion.roomType = null;
    } 
    setEmptyValue(false)
    updateSearch(suggestion)
  };

  const handleChange = (suggestion) => {
    updateSearch(suggestion)
  };

  const handleSearchBtn = () => {
    const obj = searchBtnRef.current;
    const toQueryString = (obj) => {
      return Object.entries(obj)
          .map(([key, value]) => {
              // If value is null, set it as "null", else encode the value
              const encodedValue = value === null ? 'null' : encodeURIComponent(value);
              return `${encodeURIComponent(key)}=${encodedValue}`;
          })
          .join('&');
  };
  const url = window.location.href
  const searchPage = ['search-room', 'deal-in-hotel-rooms'].some((str) => url.includes(str))
  // console.log(searchPage);
  const queryString = toQueryString(obj);
    searchPage ? navigate(`/search-room?${queryString}`) : navigate(`/search-hotel?${queryString}`)
    // navigate(`/search?${queryString}`);
  };

  // Common Autocomplete props
  const autocompletePropsHotel = {
    onChange: handleChange,
    onSelect: handleSelect,
    fetchSuggestions,
    suggestionsList: searchHotelList,
    loadingHotel,
    renderSuggestion: (suggestion) => suggestion?.hotelName || 'Unknown',
    debounceDelay: 1000,
    loadingIcon: <div>Loading...</div>,
    inputClass: 'custom-input',
    listClass: 'custom-list',
    itemClass: 'custom-item',
    title: 'hotelName'
  };

  const autocompleteProps = {
    onChange: handleChange,
    onSelect: handleSelect,
    fetchSuggestions,
    suggestionsList: searchList,
    loading,
    renderSuggestion: (suggestion) => suggestion?.address || 'Unknown',
    debounceDelay: 1000,
    loadingIcon: <div>Loading...</div>,
    inputClass: 'custom-input',
    listClass: 'custom-list',
    itemClass: 'custom-item',
    title: 'address'
  };

  useEffect(() => {
    searchBtnRef.current = searchBtn;
  }, [searchBtn]);

  // Effect to toggle visibility
  useEffect(() => {
    setHide(!hotelname ? 'block' : 'hidden');
  }, [hotelname]);

  useEffect(() => {
    const url = urlLocal == '/deal-in-hotel-rooms' ? true : false;
    setMatchUrl(url)
    console.log(matchUrl);
    
  }, [urlLocal])
  

  return (
    <div className={`max-w-7xl mx-auto ${hide}`}>
      <h1 className="text-3xl font-semibold text-white text-center">
        Save on Company Travel Expenses
      </h1>
      <p className="mt-2 text-sm text-white text-center">Direct Deals, Direct Ownership</p>

      <div className="container-search mx-auto px-4 mt-10">
        <div className="bg-white p-6 rounded-md rounded-b-none">
          <form className={`${!matchUrl ? "grid md:grid-cols-4 gap-4" : "grid md:grid-cols-3 gap-4"}`}>
            {/* Hotel Name Autocomplete */}
            {!matchUrl && <div className="md:flex items-center relative">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Hotel Name</label>
                <Autocomplete {...autocompletePropsHotel} placeholder="Search for hotels..." />
              </div>
            </div>
            }

            {/* Location Autocomplete */}
            <div className="flex-1">
              <label className="block text-gray-700 mb-2">Location</label>
              <Autocomplete {...autocompleteProps} placeholder="Search for locations..." />
            </div> 

            {matchUrl && <div>
              <label className="block text-gray-700 mb-2">Room Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600" onChange={(e) => handleSelect({'roomType': e.target.value})}>
                <option>--Room Type--</option>
                <option>Deluxe</option>
                <option>Standerd</option>
              </select>
            </div>
            }

            {/* Hotel Type Dropdown */}
            {!matchUrl && <div>
              <label className="block text-gray-700 mb-2">Hotel Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600" onChange={(e) => handleSelect({'type': e.target.value})}>
                <option>--Hotel Type--</option>
                <option>2 Star</option>
                <option>3 Star</option>
                <option>5 Star</option>
                <option>Home Stay</option>
                <option>Guest House</option>
              </select>
            </div>
            }

            {/* Search Button */}
            <div className="mt-8">
              <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md" type='button' onClick={handleSearchBtn} disabled={emptyValue}>Search</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBlock;
