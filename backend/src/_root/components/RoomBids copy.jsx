import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addRooms, fetchRooms, getListData, updateHotelId } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { convertStrUrl } from '../../utils/common_utils';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import Modal from '../../utils/Modal';
import Formik from './common/Formik';
import ImageUploadForm from './common/ImageUploadForm';

function RoomsBids({closeModal, title, hotelId, hotelName}) {
    const [pageConfig, setPageConfig] = useState({"hotelId":hotelId, "limit": "10", "offset": "0"});
    const dispatch = useDispatch();
    
    let roomData = useSelector((state) => state.rooms.rooms);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [formData, setFormData] = useState([])
    const getList = useSelector((state) => state.getList.getList); 
    const [formTitle, setFormTitle] = useState('')
    const [formMode, setFormMode] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [isImagesOpen, setIsImagesOpen] = useState(false);
    const [roomType, setRoomType] = useState(null)

    const fields = [{ roomNumber: '', roomtype: '', capacity: '', pricePerNight: '', startDate: '', endDate: '', amenities: ''}]
    const fieldsName = [{ roomNumber: 'Room Number', roomtype: 'Room Type', capacity: 'Capacity', pricePerNight: 'price Per Night', startDate: 'Start Date', endDate: 'End Date', amenities: 'Amenities'}];

    useEffect(()=>{
        dispatch(fetchRooms(pageConfig)) 
        dispatch(getListData()); 
    },[dispatch])

    useEffect(()=>{
        setRowData(roomData)      
    },[roomData])

    const actionHandler = (e, action) => {
        if(action == 'delete'){
            serviceCall(e.data, action)
        } else {
                if(action != 'Add'){
                    const convertArr = [e.data];
                    const data = convertArr.map(item =>
                        Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [key, value == null ? '' : value])
                        )
                    );
                    setRoomId(e.data.roomId);
                    setFormData(data)
                }else{
                    setFormData(fields)
                    setRoomId(null);
                }
                setFormMode(action)
                setFormTitle(`${action} Hotel`)        
                setIsSignInOpen(true)
            }
    }

    const addImagesHanlder = (e) => {
        setRoomType(e.data.roomtype);
        setRoomId(e.data.roomId)
        setIsImagesOpen(true)
    }
    
    const CustomButtonComponent = (props) => {
        return (<>
            <button onClick={(e) => actionHandler(props, 'Edit')} className='bg-green-700 py-1 px-1 rounded-sm text-xs text-white mr-2'><span>Edit</span></button>
            <button onClick={(e) => actionHandler(props, 'View')}  className='bg-blue-700 py-1 px-1 rounded-sm text-xs text-white mr-2'><span>View</span></button>
            <button onClick={(e) => actionHandler(props, 'delete')} className='bg-red-700 py-1 px-1 rounded-sm text-xs text-white mr-2'><span>Del</span></button>
            <button onClick={(e) => addImagesHanlder(props)} className='bg-gray-700 py-1 px-1 rounded-sm text-xs text-white'><span>+ Images</span></button>
        </>
        )
    };

    const [colDefs, setColDefs] = useState([
        { field: "roomId", flex: 1 },
        { field: "roomNumber", flex: 2 },
        { field: "roomType", flex: 1 },
        { field: "capacity", flex: 1 },
        { field: "pricePerNight", flex: 1 },
        { field: "startDate", flex: 1 },
        { field: "Action", flex: 2, cellRenderer: CustomButtonComponent },
    ]);
    const [rowData, setRowData] = useState([]);

    const closeModals = () => {
        setIsSignInOpen(false);
        setIsImagesOpen(false)
    };
   
    const onSubmit = async (data) => {
        const mode = formMode == 'Add' ? 'add' : formMode == 'Edit' ? 'update' : 'view';
        mode != 'Add' ? data.fields[0]['hotelId'] = hotelId : data.fields[0]['hotelId'] = null;
        const amenity = data.fields[0].amenities.join(',')
        
        data.fields[0].amenities = getList.amenities.filter(res=>amenity.includes(res.name));
        data.fields[0].roomtype = getList.roomTypes.filter(res=>res.name==data.fields[0].roomtype);
        const updatedData = data?.fields[0];
        await serviceCall(updatedData, mode)
        
    };

    const serviceCall = async(data, mode) =>{
        mode == 'delete' ? await dispatch(addRooms({'roomId': data.roomId}, mode)) : await dispatch(addRooms(data, mode));
        await dispatch(fetchRooms(pageConfig));
        setIsSignInOpen(false);
    }

    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] overflow-auto my-10 relative rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-red-700 px-2 py-3 text-white text-sm">
          {title}
          <button onClick={closeModal} className="absolute right-4 text-gray-900 hover:text-gray-900 bg-white px-2 rounded-sm">Close</button>
        </h2>
        <button onClick={(e) => actionHandler(null, 'Add') }><span className='ml-6 bg-red-700 py-2 px-2 rounded-md text-xs text-white mr-2'>Add new room</span></button>
        
        {roomData.length == 0 && (<div className='flex justify-center items-center'>0 Record found</div>)}
            
            <div className='md:flex justify-between m-6'>
                <div className='flex-1'>
                        <div className="overflow-x-auto">
                        {roomData.length > 0 && (
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
                </div>
                {isSignInOpen && (
                    <Modal closeModal={closeModals}>
                        <Formik data={formData} amenityList={getList} closeModal={closeModals} formTitle={formTitle} formFields={fields} formFieldsName={fieldsName} onSubmit={onSubmit} />
                    </Modal>
                )}
                {isImagesOpen && (
                <Modal closeModal={closeModals}>
                    <ImageUploadForm hotelId={hotelId} hotelName={hotelName} closeModal={closeModals} useInPage={'room'} roomId={roomId} roomType={roomType} />
                </Modal>
            )}
            </div>
    </div>
    </div>
    )
}

export default RoomsBids