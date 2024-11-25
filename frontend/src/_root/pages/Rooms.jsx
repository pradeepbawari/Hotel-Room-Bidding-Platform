import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, updateHotelId } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { convertStrUrl } from '../../utils/common_utils';

function Rooms() {
    const [pageConfig, setPageConfig] = useState({ hotelId: null, limit: "10", offset: "0", orderBy: [{ sort: "ASC", colId: "room_id" }], filters: null, type:'website' });
    const [divHidden, setDivHidden] = useState('hidden');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    let roomData = useSelector((state) => state.rooms.rooms);
    
    useEffect(()=>{
        dispatch(fetchRooms(pageConfig))        
    },[dispatch])
    
    const toggleSearch = () => {
        setDivHidden(item=> item == 'hidden' ? '' : 'hidden');
        setIsOpen(!isOpen);
    }

    const bidsNow = (hotelName, hotelId, roomId) => {
        const url = convertStrUrl(hotelName)
        dispatch(updateHotelId(hotelId, 'UPDATE_HOTEL_ID'))
        dispatch(updateHotelId(roomId, 'UPDATE_ROOM_ID'))
        sessionStorage.setItem('bidRoom', JSON.stringify({'hotelId': hotelId, 'roomId': roomId}))
        navigate(`/bids-in-hotel-and-rooms/${url}`);  
    }

    if(roomData.length==0) return <div className='flex justify-center'>Loading...</div>

    
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
                {roomData && roomData.length && roomData.map((room, index) => (
                    <div key={room.roomId} className="grid md:grid-cols-3 gap-4 md:flex border p-3 justify-between mb-3">
                    <div className='thumbnail'>
                        <img src={`src/assets/images/${room.bigImg}`} alt="Thumbnail" />
                    </div>

                    <div className="col-span-1 flex-1">
                        <h2 className="text-xl font-semibold">{room.hotelName}</h2>
                        <p className="text-gray-600">Location: <span className='text-sm'>{room.city}, {room.state}, {room.country}, ({room.address})</span></p>
                        <p className="text-gray-600 py-2">Aminities: <span className='text-sm'>{room.amenity}</span></p>
                        <p className="text-gray-600 py-0">Category: {room.hoteltype}</p>
                        <p className="text-gray-600 py-0">Room: <span className='text-sm'>{room.roomType} - {room.capacity} /per person - (room no. {room.roomNumber})</span></p>
                        {/* <p className="text-gray-600 py-0 text-sm">Room Type: {room.roomType}</p> */}
                    </div>

                    <div className="col-span-1">
                        <p className="text-gray-600 font-bold text-base/2">₹{room.pricePerNight} <span className='text-sm font-normal'>/room</span> <span className='font-normal text-sm'>Avg Bid</span></p>
                        <p className="text-gray-600"><span className='font-bold'>{room.inactiveRoomCount}</span> rooms (avail)</p>
                        <p className="text-gray-600"><span className='font-bold'>10</span> bids</p>
                        <p className="text-gray-600"><span className='font-bold'>Start</span>: {room.endDate}</p>
                        <p className="text-gray-600"><span className='font-bold'>End</span>: {room.startDate}</p>
                        <p className='flex text-sm justify-between'>
                            <button className="w-full px-1 py-1 bg-red-500 text-white rounded-md mt-3" onClick={()=>bidsNow(room.hotelName, room.hotelId, room.roomId)}>Bids</button>
                            <span className='px-1'></span>
                            <button className="w-full px-1 py-1 bg-blue-500 text-white rounded-md mt-3" onClick={()=>bidsNow(room.hotelName, room.hotelId, room.roomId)}>Bid Now</button>                            
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Rooms