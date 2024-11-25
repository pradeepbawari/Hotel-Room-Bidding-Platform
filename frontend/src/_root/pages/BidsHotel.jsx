import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addUpdateBid, fetchBidByHotel } from '../../redux/actions';
import { convertDateFormat, localStorageGet } from '../../utils/common_utils';
import BidRequest from '../components/BidRequest';

const BidsHotel = () => {
  const [pageConfig, setPageConfig] = useState({ hotelId: null, limit: "10", offset: "0" });
  const [pageRoomConfig, setPageRoomConfig] = useState({ roomId: null, limit: "10", offset: "0" });
  const userData = localStorageGet('userData');
  let currentHotelRoomId = JSON.parse(sessionStorage.getItem('bidHotel'));

  const dispatch = useDispatch()
  const [updateAgentBidPrice, setUpdateAgentBidPrice] = useState([]);  
  // let currentHotelRoomId = useSelector((state) => state.updateHotelId);
  let data = useSelector((state) => state.hotelbid.hotelbid);
  let updatePrice = useSelector((state) => state.addUpdateBid.addUpdateBid);
  let [updateBidPrice, setUpdateBidPrice] = useState([])
  // let u = useSelector(state=>console.log(state))
  
  const updateRHIds = async () => {
    if (currentHotelRoomId != null) {
      const updatedConfig = {
          ...pageConfig,
          hotelId: currentHotelRoomId.hotelId,
          roomId: currentHotelRoomId.roomId,
      };
      setPageConfig(updatedConfig);
      await dispatch(fetchBidByHotel(updatedConfig))
    }
  }

  const bidOnRoom = async ({roomData, bidAmount, update, dealId}) =>{ 
    const userInput = {
      "travelAgentId": userData.travelAgentId, 
      "dealDate": convertDateFormat(new Date(), 'number'), 
      "dealPrice": bidAmount,
      "hotelId": data?.hotelData.hotelId
    }
    update = update != 'update' ? 'addbidbyhotel' : 'updatebidbyhotel';
    update == 'updatebidbyhotel' ? userInput['dealId'] = dealId : userInput;
    update == 'updatebidbyhotel' ? userInput.hotelId = data?.hotelData?.hotelId : userInput;
    await dispatch(addUpdateBid(userInput, update))    
  }

  useEffect(() => {
    updateRHIds();    
    updatePrice = [];
  }, [dispatch])

  
  useEffect(()=>{
    setUpdateBidPrice([])
    if(updatePrice.length){
      const updatedData = {
        ...data,
        hotelDealDetail: data.hotelDealDetail.map(res => {
          const updatedPrice = updateBidPrice.find(price => price.roomId == res.roomId && price.dealId == res.dealId);
          if (updatedPrice) {
            return {
              ...res,
              dealPrice: updatedPrice.dealPrice
            };
          }
          return res;
        })
      };
      setUpdateAgentBidPrice(updatePrice);                  
    }
    updatePrice = [];
}, [updatePrice])

  if (data && data?.hotelData?.length == 0) return <div className='flex justify-center'>Loading...</div>

  return (
    <div className='md:flex justify-between'>
      <div className='grow'>
        <div className="grid md:grid-cols-3 gap-4 md:flex p-3 justify-between mb-3">
          <div className="col-span-1 flex-1 md:border mt-100 bg-white rounded-md p-3 md:p-8">
            {data && data?.hotelData && (
              <>
              <div key={data?.hotelData.hotelId}>
                <div className="text-3xl font-semibold flex justify-between">
                  <h2>{data?.hotelData.hotelName}</h2>
                  <span className='text-base font-normal bg-gray-100 py-1 px-2 rounded-md'>{data?.hotelData.status}</span>
                </div>
                <p className="text-gray-600">Location: <span>{data?.hotelData.city}, {data?.hotelData.state}, {data?.hotelData.country}, ({data?.hotelData.address})</span></p>
                <p className="text-gray-600 py-2">Aminities:</p>
                <p className='leading-9 text-wrap'>  
                  {data?.hotelData.amenity.length && data?.hotelData.amenity.map((amit, index) => (
                    <span key={index} className='border px-2 py-1 bg-gray-100 text-sm me-1 rounded-md'>{amit}</span>))
                  }
                </p>
                <p className="text-gray-600 py-0">Category: {data?.hotelData.hoteltype}</p>
                <p className="text-gray-600 py-0">Room: <span>{data?.hotelData.roomType} - {data?.hotelData.capacity} /per person</span></p>
              </div>
            <div className='mt-5'>
              <h3 className='text-xl font-semibold border-b-2 py-3'>Hotel View</h3>
                <div className='grid'>
                  <div className='mt-5 md:flex'>
                      <img src={`../src/assets/images/hotel.jpg`} alt="Thumbnail" />
                      <img src={`../src/assets/images/hotel.jpg`} alt="Thumbnail" />
                  </div>
                </div>
            </div>
            <div className='mt-5'>
                <div className='grid'>
                  <BidRequest roomData={data?.hotelData} bidData={updateAgentBidPrice.length > 0 ? updateAgentBidPrice : data?.hotelDealDetail} bidOnRoom={bidOnRoom} title={'Bidding for this hotel'} bidPriceTitle={'Your Bid for this hotel is'} />  
                </div>
              {/* ))} */}
            </div>
            </>
            )}
          </div>

          <div className="flex-none md:w-80">
            <div className=''>
              <img src={`../src/assets/images/hotel.jpg`} alt="Thumbnail" />
            </div>
            {/* <p className="text-gray-600 font-bold text-base/2">₹{room.pricePerNight} <span className='text-sm font-normal'>/room</span> <span className='font-normal text-sm'>Avg Bid</span></p>
                        <p className="text-gray-600"><span className='font-bold'>{room.inactiveRoomCount}</span> rooms (avail)</p>
                        <p className="text-gray-600"><span className='font-bold'>10</span> bids</p>
                        <p className="text-gray-600"><span className='font-bold'>Start</span>: {room.endDate}</p>
                        <p className="text-gray-600"><span className='font-bold'>End</span>: {room.startDate}</p> */}
            {/* <p className='flex text-sm justify-between'>
                            <button className="w-full px-1 py-1 bg-red-500 text-white rounded-md mt-3" onClick={()=>bidsNow(room.hotelName, room.hotelId)}>Bids</button>
                            <span className='px-1'></span>
                            <button className="w-full px-1 py-1 bg-blue-500 text-white rounded-md mt-3" onClick={()=>bidsNow(room.hotelName, room.hotelId)}>Bid Now</button>                            
                        </p> */}
          </div>
        </div>

      </div>
    </div>
  )
}

export default BidsHotel