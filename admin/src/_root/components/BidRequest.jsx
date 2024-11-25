import React, { useEffect, useState } from 'react'
import BidList from '../components/BidList'
import { localStorageGet } from '../../utils/common_utils';

const BidRequest = ({ roomData, bidData, bidOnRoom, title, bidPriceTitle }) => {

    const userData = localStorageGet('userData')
    
    const [bidAmount, setBidAmount] = useState('');
    const [agentBidAmount, setAgentBidAmount] = useState(0);
    const [inputDisbled, setInputDisbled] = useState(false);
    const [alertValid, setAlertValid] = useState(false)
    const [dealId, setDealId] = useState(false)

    const setDealPrice = (bid) => {
        let currentAmount = null;
        setAgentBidAmount((prevPrice) => {
            return currentAmount = prevPrice;
        })
        setAgentBidAmount(bid.dealPrice)
        if(currentAmount!=null){
            setInputDisbled(true)
        }
    }
    
    const setAgentDealPrice = () =>{
        setAgentBidAmount(0);
        setInputDisbled(false);
        bidData && bidData.length ? bidData.map(bid => {
            if(bid.travelAgentId == userData.travelAgentId && bid.roomId == roomData.roomId){
                setDealPrice(bid)
                setDealId(bid.dealId)
                setAgentBidAmount(bid.dealPrice)
            }
        }) : null;
    } 

    const bidAmountHandler = (e) => {
        setBidAmount(value => value = e.target.value)
    }

    useEffect(()=>{
        setAgentDealPrice();
    }, [bidAmount, bidData])

    return (
        <>
            <div className='md:flex mt-10 mb-5'>
                <div className='flex-1'>
                    <h4 className='text-xl font-semibold'>Place your bid</h4>
                    <div className="flex-1 py-2">
                        <label className="block text-gray-700 font-semibold text-sm">Bid amount</label>
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={bidAmountHandler}
                            placeholder={`same or up to : ₹${roomData.pricePerNight} /per room`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600" disabled={inputDisbled}
                        />
                        {!inputDisbled && bidAmount == '' && alertValid ? <span className='text-red-500 grid'>Please enter valid number</span> : '' }
                        {agentBidAmount != 0 && <span>{bidPriceTitle} <span className='text-lg text-bold'>₹{agentBidAmount}</span><button className='grid text-blue-900' onClick={(e)=>(setInputDisbled(false), setAlertValid(true))}>Change price</button></span> }
                    </div>
                    <div className="flex-1 py-2">
                    
                        <button disabled={inputDisbled} type='button' onClick={(e) => agentBidAmount ? (bidOnRoom({roomData, bidAmount, update:'update', dealId}), setInputDisbled(true)) : (bidOnRoom({roomData, bidAmount, update:'add', dealId:null}), setInputDisbled(true))} className={`w-full px-3 py-2 border rounded-md focus:outline-none text-lg font-bold ${agentBidAmount ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 text-gray-700'}`}>{agentBidAmount ? 'Update Your Bid' : 'Bid on the room'}</button>
                    
                        {/* {!addButton && <button type='button' onClick={(e) => bidOnRoom({roomData, bidAmount})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 text-lg font-bold text-gray-700">Bid on the room</button>}
                        {addButton && !updateButton && <button type='button' onClick={(e)=>(setAddButton(true) && setUpdateButton(true))} className="bg-red-500 w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:border-blue-600 text-lg font-bold text-white">Update Your Bid 1</button>}
                        {updateButton && <button type='button' onClick={(e)=>bidOnRoom({roomData, bidAmount})} className="bg-red-500 w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:border-blue-600 text-lg font-bold text-white">Update Your Bid</button>} */}
                    </div>
                </div>
                <div className='flex-1 md:ml-10 mt-5 md:mt-0'>
                    <h4 className='text-xl font-semibold'>{title}</h4>
                    <div className='text-gray-500 max-h-28 overflow-auto leading-8'>
                        {dealId && bidData && bidData.length && bidData.map(bid =>
                           roomData.roomId == bid.roomId ? <BidList key={bid.dealId} bid={bid} dealId={bidData} /> : ''
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BidRequest