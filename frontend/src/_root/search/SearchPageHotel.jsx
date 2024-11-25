import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, searchHotelPage, updateHotelId } from '../../redux/actions';
import { convertStrUrl } from '../../utils/common_utils';
import { useLocation, useNavigate } from 'react-router-dom';

function SearchPageHotel() {

    const { search } = useLocation();
    
    // const [pageConfig, setPageConfig] = useState({"limit": "10", "offset": "0"});
    const [pageConfig, setPageConfig] = useState({ limit: "10", offset: "0", orderBy: [{ sort: "ASC", colId: "hotel_id" }], filters: null });
    const [divHidden, setDivHidden] = useState('hidden');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const hotelsData = useSelector((state) => state.searchHotelPage.searchHotelPage);
    
    useEffect(()=>{
        dispatch(searchHotelPage(search))
    },[dispatch, search])
    
    const toggleSearch = () => {
        setDivHidden(item=> item == 'hidden' ? '' : 'hidden');
        setIsOpen(!isOpen);        
    }

    const bidsNow = (hotelName, hotelId) => {
        const url = convertStrUrl(hotelName)
        dispatch(updateHotelId(hotelId, 'UPDATE_HOTEL_ID'))
        navigate(`/bids-in-hotel/${url}`);  
    }
    
    // if(hotelsData && hotelsData.length==0) return <div className='flex justify-center'>Loading...</div>

    
    return (
        <div className='md:flex justify-between'>
            <div className='flex-none w-48 mr-10 mb-1 p-3'>

                <div className='flex'>
                    <h1 className='md:text-lg text-md font-bold mr-10'>Select Filters</h1>
                    <div className='md:hidden sm:block xs:block'>
                        <button id="menu-btn" className="text-blue-600 focus:outline-none" onClick={toggleSearch}>
                            <svg
                                className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={`grid justify-between relative mt-5 ${divHidden} md:block`}>
                    <div className='flex justify-between relative mt-5'>
                        <label className="filter-flex text-sm text-gray-600 mr-10">
                        <input type="checkbox" className='border border-slate-300 rounded-md mr-2' />
                        Nainital
                        </label>
                        <span className='text-gray-400 text-xs'>(50)</span>
                    </div>
                    <div className='flex justify-between relative mt-5'>
                        <label className="filter-flex text-sm text-gray-600 mr-10">
                        <input type="checkbox" className='border border-slate-300 rounded-md mr-2' />
                        Ramnagar
                        </label>
                        <span className='text-gray-400 text-xs'>(50)</span>
                    </div>
                </div>

            </div>
            <div className='flex-1'>
                {hotelsData.length==0 && (
                    <div className="grid md:grid-cols-12 gap-4 md:flex border p-3 justify-center">
                        {'no record found'}
                    </div>
                )}
                {hotelsData && hotelsData.length > 0 && hotelsData.map((hotel, index) => (
                    <div key={hotel.hotelId} className="grid md:grid-cols-3 gap-4 md:flex border p-3 justify-between">
                    <div className='thumbnail'>
                        <img src={`src/assets/images/hotel.jpg`} alt="Thumbnail" />
                    </div>

                    <div className="col-span-1 flex-1">
                        <h2 className="text-xl font-semibold">{hotel.hotelName}</h2>
                        <p className="text-gray-600">Location: {hotel.city}, {hotel.state}, {hotel.country}, ({hotel.address})</p>
                        <p className="text-gray-600 py-2">Aminities: {hotel.amenity}</p>
                        <p className="text-gray-600 py-2">Hotel Type: {hotel.hoteltype}</p>
                    </div>

                    <div className="col-span-1">
                        <p className="text-gray-600 font-bold text-base/2">₹15000 <span className='font-normal text-sm'>Avg Bid</span></p>
                        <p className="text-gray-600"><span className='font-bold'>10</span> bids</p>
                        <p className="text-gray-600"><span className='font-bold'>Start</span>: 20-5-2024</p>
                        <p className="text-gray-600"><span className='font-bold'>End</span>: 20-6-2024</p>
                        <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md mt-3"  onClick={()=>bidsNow(hotel.hotelName, hotel.hotelId)}>Bid Now</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default SearchPageHotel