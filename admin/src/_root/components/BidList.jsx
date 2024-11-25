import { useEffect, useState } from "react";

const BidList = ({ bid, dealId }) => {
  const [bidAmount, setBidAmount] = useState(bid.dealPrice);
  const [agentName, setAgentName] = useState(bid.agentName);

  useEffect(()=>{
    setBidAmount(bid.dealPrice)
  }, [dealId])

  return (
      <div className="flex justify-between border-b-2 pr-10 border-inherit">
        <span className="capitalize">{agentName}</span> <span className='font-semibold text-md'>₹{bidAmount}</span>
    </div>
  );
};

export default BidList;
