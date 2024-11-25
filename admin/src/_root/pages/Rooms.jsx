import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, getListData } from '../../redux/actions';
import Modal from '../../utils/Modal';
import RoomsBids from '../components/RoomBids';
import Table from '../components/common/Table';

const Rooms = () => {
    const [pageConfig, setPageConfig] = useState({ limit: "10", offset: "0", orderBy: [{ sort: "ASC", colId: "hotel_id" }], filters: null });
    
    const hotelsData = useSelector((state) => state.hotels.hotels);
    const getList = useSelector((state) => state.getList.getList); 
    
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [formTitle, setFormTitle] = useState('')
    const [hotelId, setHotelId] = useState(null)
    const [hotelName, setHotelName] = useState(null)
    const [rowData, setRowData] = useState([]);
    const gridApiRef = useRef();
    
    const actionHandler = (e, action) => {
        setHotelId(e.data.hotelId);
        setHotelName(e.data.hotelName);
        setFormTitle(`${e.data.hotelName}`)        
        setIsOpen(true)        
    }

    const CustomButtonComponent = (props) => {
        return (<>
            <button onClick={(e) => actionHandler(props, 'Edit')} className='bg-green-700 py-1 px-1 rounded-sm text-xs text-white mr-2'><span>View Rooms</span></button>            
        </>
        )
    };

    const [colDefs, setColDefs] = useState([
        { field: "hotelId", headerName: "Hotel Id", flex: 1, sortable: true, filter: true },
        { field: "hotelName", headerName: "Hotel Name", flex: 2, sortable: true, filter: true },
        { field: "hoteltype", headerName: "Hotel Type", flex: 1, sortable: true, filter: true },
        { field: "city", headerName: "City", flex: 1, sortable: true, filter: true },
        { field: "state", headerName: "State", flex: 1, sortable: true, filter: true },
        { field: "country", headerName: "Country", flex: 1, sortable: true, filter: true },
        { field: "address", headerName: "Address", flex: 2, sortable: true, filter: true },
        { field: "amenity", headerName: "Amenity", flex: 2, sortable: true, filter: true },
        { field: "Action", headerName: "Action", sortable: false, cellRenderer: CustomButtonComponent }
    ]);
    
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
          await dispatch(fetchHotels(pageConfig));
        };
        fetchData();
      }, [dispatch, pageConfig]);

      useEffect(() => {
        dispatch(getListData());
      }, []);

    useEffect(()=>{
        setRowData(hotelsData.results)
    },[hotelsData])

    const closeModals = () => {
        setIsOpen(false);
        // setIsImagesOpen(false)
    };

  
    if(hotelsData.total==0) return <div className='flex justify-center'>Loading...</div>

    
    return (
        <div>
            <div className='flex justify-between w-full'>
                <h2 className="text-lg font-semibold mb-4">Hotels Room Bids</h2>                
            </div>
            <div className="overflow-x-auto">
            {hotelsData.total > 0 && (
                <Table
                rowData={rowData}
                colDefs={colDefs}
                onGridReady={onGridReady}
                onSortChanged={onSortChanged}
                onFilterChanged={onFilterChanged}
                gridApiRef={gridApiRef}
                actionHandler={actionHandler}
                paginationChangedEvent={PaginationChangedEvent}
                totalRecords={hotelsData.total}
                />
            )}
            </div>
            {isOpen && getList && (
                <Modal closeModal={closeModals}>
                    <RoomsBids closeModal={closeModals} title={formTitle} hotelId={hotelId} hotelName={hotelName} getList={getList} />
                </Modal>
            )}
        </div>
    )
}

export default Rooms