import React, { useEffect, useState } from 'react'
import Autocomplete from '../components/common/Autocomplete';
import { useParams } from 'react-router-dom';

const SearchBlock = () => {

    const {hotelname} = useParams()
    const [hide, setHide] = useState('hidden');

    useEffect(()=>{
        (hotelname == undefined || hotelname == null || hotelname == '') ? setHide('block') : setHide('hidden')
    },[hotelname])
    
    
  return (
        <div className={`max-w-7xl mx-auto ${hide}`}>
        <h1 className="text-3xl font-semibold text-white text-center">
            Save on Company Travel Expenses
        </h1>
        <p className="mt-2 text-ms text-white text-center">
            {/* Direct from Owner, Direct to Ownership */}
            Direct Deals, Direct Ownership
        </p>

            <div className="container-search mx-auto px-4 mt-10">
                <div className="bg-white p-6 rounded-md rounded-b-none">
                {/* <h2 className="text-2xl font-semibold mb-4 text-blue-600">Search</h2> */}
                <form className="grid md:grid-cols-4 gap-4">
                    <div className="md:flex items-center relative">
                        <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Hotel Name</label>
                        <Autocomplete />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                        />
                    </div>
                    {/* <div>
                    <label className="block text-gray-700 mb-2">Return Date</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                    />
                    </div> */}
                    <div>
                    <label className="block text-gray-700 mb-2">Hotel Type</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
                    >
                        <option>--Select Type--</option>
                        <option>2 Star</option>
                        <option>3 Star</option>
                        <option>5 Star</option>
                        <option>Home Stay</option>
                        <option>Guest House</option>
                    </select>
                    </div>
                    <div className='mt-8'>
                        <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md">Search</button>
                    </div>
                    
                </form>
                </div>
            </div>

    </div>
  )
}

export default SearchBlock

