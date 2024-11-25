import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import Table from './common/Table';
import stringList from "../../utils/formFildsName.json";
import Button from './common/Button';
import { FontAwesomeIcon, faPlus, faPencil, faEye, faTrash, faImages, faXmark } from "../../utils/fontAwesomeIcons";

function RoomsBids({closeModal, title, hotelId, hotelName, getList}) {
    // const [pageConfig, setPageConfig] = useState({"hotelId":hotelId, "limit": "10", "offset": "0"});
    const [pageConfig, setPageConfig] = useState({ "hotelId":hotelId, roomId: null, limit: "10", offset: "0", orderBy: [{ sort: "ASC", colId: "room_id" }], filters: null, type:'software' });
    const dispatch = useDispatch();
    
    let roomData = useSelector((state) => state.rooms.rooms);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState([])
    const [inputData, setInputData] = useState([]);
    // const getList = useSelector((state) => state.getList.getList); 
    const [formTitle, setFormTitle] = useState('')
    const [formMode, setFormMode] = useState(null)
    const [roomId, setRoomId] = useState(null)
    const [isImagesOpen, setIsImagesOpen] = useState(false);
    const [roomType, setRoomType] = useState(null)
    const gridApiRef = useRef();

    const fields = [{ roomNumber: '', roomtype: '', capacity: '', pricePerNight: '', startDate: '', endDate: '', amenities: ''}]
    const fieldsName = [{ roomNumber: 'Room Number', roomtype: 'Room Type', capacity: 'Capacity', pricePerNight: 'price Per Night', startDate: 'Start Date', endDate: 'End Date', amenities: 'Amenities'}];

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };
    
    const onSortChanged = (params) => {
        const sortModel = params.api.sortController.getSortModel();
        if (sortModel.length) setPageConfig((prev) => ({ ...prev, orderBy: sortModel }));
    };
    
    const onFilterChanged = (params) => {
        const filterModel = params.api.getFilterModel();
        setPageConfig((prev) => ({ ...prev, filters: filterModel }));
    };
    
    const PaginationChangedEvent = useCallback((params, page) => {
        setPageConfig((prev) => ({ ...prev, offset: params.paginationGetPageSize() * page + 1 }));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          await dispatch(fetchRooms(pageConfig));
        };
        fetchData();
      }, [dispatch, pageConfig]);

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
                    setInputData(data)
                }else{
                    setInputData(fields)
                    setRoomId(null);
                }
                setFormMode(action)
                setFormTitle(`${action} Hotel`)        
                setIsOpen(true)
            }
    }

    const addImagesHanlder = (e) => {
        setRoomType(e.data.roomtype);
        setRoomId(e.data.roomId)
        setIsImagesOpen(true)
    }
    
    const CustomButtonComponent = (props) => {
        return (<>
            <Button onClick={actionHandler} props={props} mode={'Edit'} icon={<FontAwesomeIcon icon={faPencil} />} iconColor={'text-green-800'} />
            <Button onClick={actionHandler} props={props} mode={'View'} icon={<FontAwesomeIcon icon={faEye} />} iconColor={'text-blue-500'}/>
            <Button onClick={actionHandler} props={props} mode={'delete'} icon={<FontAwesomeIcon icon={faTrash} />} iconColor={'text-red-500'} />
            <Button onClick={addImagesHanlder} props={props} mode={'images'} icon={<FontAwesomeIcon icon={faImages} />} iconColor={'text-orange-500'} />            
        </>
        )
    };

    const [colDefs, setColDefs] = useState([
        { field: "roomId", headerName: "Room Id", flex: 2, sortable: true, filter: true },
        { field: "roomNumber", headerName: "Room Number", flex: 2, sortable: true, filter: true },
        { field: "roomType", headerName: "Room Type", flex: 2, sortable: true, filter: true },
        { field: "capacity", headerName: "Capacity", flex: 2, sortable: true, filter: true },
        { field: "pricePerNight", headerName: "Price/Night", flex: 2, sortable: true, filter: true },
        { field: "startDate", headerName: "Start Date", flex: 2, sortable: true, filter: true },
        { field: "endDate", headerName: "End Date", flex: 2, sortable: true, filter: true },
        { field: "Action", headerName: "Action", sortable: false, cellRenderer: CustomButtonComponent, minWidth: '150' }
    ]);
    const [rowData, setRowData] = useState([]);

    const closeModals = () => {
        setIsOpen(false);
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
        setIsOpen(false);
    }

    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] overflow-auto my-10 relative rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-start bg-red-700 px-2 py-3 text-white text-sm">
                {title}
            <button onClick={closeModal} className="absolute right-4 top-2 py-0 rounded-sm">
                <FontAwesomeIcon icon={faXmark} size="2x" />
            </button>
        </h2>
        <button onClick={(e) => actionHandler(null, 'Add') }><span className='ml-6 bg-red-700 py-2 px-2 rounded-md text-xs text-white mr-2'>Add new room</span></button>
        
        {roomData.length == 0 && (<div className='flex justify-center items-center'>0 Record found</div>)}
            
            <div className='md:flex justify-between m-6'>
                <div className='flex-1'>
                        <div className="overflow-x-auto">
                        {roomData.length > 0 && (                      
                            <Table
                            rowData={rowData}
                            colDefs={colDefs}
                            onGridReady={onGridReady}
                            onSortChanged={onSortChanged}
                            onFilterChanged={onFilterChanged}
                            gridApiRef={gridApiRef}
                            actionHandler={actionHandler}
                            paginationChangedEvent={PaginationChangedEvent}
                            totalRecords={10}
                            />
                        )}
                    </div>
                </div>
                {isOpen && (
                    <Modal formTitle={formTitle} closeModal={closeModals}>
                        <Formik inputValue={inputData} amenityList={getList} closeModal={closeModals} inputLabels={stringList.roomFormLabels} onSubmit={onSubmit} />
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