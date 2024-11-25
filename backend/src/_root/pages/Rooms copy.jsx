import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, getListData } from '../../redux/actions';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import Modal from '../../utils/Modal';
import RoomsBids from '../components/RoomBids';

const Rooms = () => {
    const [pageConfig, setPageConfig] = useState({ limit: "10", offset: "0", orderBy: [{ sort: "ASC", colId: "hotel_id" }], filters: null });
    
    const hotelsData = useSelector((state) => state.hotels.hotels);
    const getList = useSelector((state) => state.getList.getList); 
    
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [formTitle, setFormTitle] = useState('')
    const [hotelId, setHotelId] = useState(null)
    const [formMode, setFormMode] = useState(null)
    const [formData, setFormData] = useState([])
    const [isImagesOpen, setIsImagesOpen] = useState(false);
    const [hotelName, setHotelName] = useState(null)
    
    const actionHandler = (e, action) => {
        setHotelId(e.data.hotelId);
        setHotelName(e.data.hotelName);
        setFormMode(action)
        setFormTitle(`${e.data.hotelName}`)        
        setIsSignInOpen(true)        
    }

    const CustomButtonComponent = (props) => {
        return (<>
            <button onClick={(e) => actionHandler(props, 'Edit')} className='bg-green-700 py-1 px-1 rounded-sm text-xs text-white mr-2'><span>View Rooms</span></button>            
        </>
        )
    };

    const [colDefs, setColDefs] = useState([
        { field: "hotelId", flex: 1 },
        { field: "hotelName", flex: 2 },
        { field: "hoteltype", flex: 1 },
        { field: "city", flex: 1 },
        { field: "state", flex: 1 },
        { field: "country", flex: 1 },
        { field: "address", flex: 2 },
        { field: "amenity", flex: 2 },
        { field: "Action", flex: 1, cellRenderer: CustomButtonComponent },
    ]);
    const [rowData, setRowData] = useState([]);
    
    useEffect(()=>{
        dispatch(fetchHotels(pageConfig)); 
        dispatch(getListData());        
    },[dispatch])

    useEffect(()=>{
        setRowData(hotelsData.results)
    },[hotelsData])

    const closeModals = () => {
        setIsSignInOpen(false);
        setIsImagesOpen(false)
    };

  
    if(hotelsData.total==0) return <div className='flex justify-center'>Loading...</div>

    
    return (
        <div>
            <div className='flex justify-between w-full'>
                <h2 className="text-lg font-semibold mb-4">Hotels Room Bids</h2>                
            </div>
            <div className="overflow-x-auto">
                {hotelsData.total > 0 && (
                    <div
                    className="ag-theme-quartz"
                    style={{ height: 500 }}
                   >
                     <AgGridReact
                         rowData={rowData}
                         columnDefs={colDefs}
                     />
                   </div>
                )}
            </div>
            {isSignInOpen && (
                <Modal closeModal={closeModals}>
                    <RoomsBids closeModal={closeModals} title={formTitle} hotelId={hotelId} hotelName={hotelName} />
                </Modal>
            )}
        </div>
    )
}

export default Rooms