import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addHotels, fetchHotels, updateHotelId, getListData } from '../../redux/actions';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import Formik from '../components/common/Formik';
import Modal from '../../utils/Modal';
import ImageUploadForm from '../components/common/ImageUploadForm';
import stringList from '../../utils/formFildsName.json' 
import { FontAwesomeIcon, faPencil, faEye, faTrash, faImages, faPlus } from '../../utils/fontAwesomeIcons';
import Button from '../components/common/Button';
import CustomPagination from './CustomPagination';
// import Table from '../components/common/Table';

const Hotels = () => {
    const [pageConfig, setPageConfig] = useState({"limit": "10", "offset": "0", "orderBy":[{sort: "ASC", colId: "hotel_id"}], "filters":null});
    
    const hotelsData = useSelector((state) => state.hotels.hotels);
    const getList = useSelector((state) => state.getList.getList); 
    
    const dispatch = useDispatch();
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [formTitle, setFormTitle] = useState('')
    const [hotelId, setHotelId] = useState(null)
    const [formMode, setFormMode] = useState(null)
    const [inputData, setInputData] = useState([])
    const [isImagesOpen, setIsImagesOpen] = useState(false);
    const [hotelName, setHotelName] = useState(null)
    const [rowData, setRowData] = useState([]);
    const gridApiRef = useRef();
    
    const form_InputLabels = stringList.hotelFormLabels;
    
    const actionHandler = (e, action) => {
        if(action == 'delete'){
            serviceCall(e.data, action)
        } else {
                if(action != 'Add'){
                    const data = [e.data].map(item =>
                        Object.fromEntries(
                        Object.entries(item).map(([key, value]) => [key, value == null ? '' : value])
                        )
                    );
                    setHotelId(e.data.hotelId);
                    setInputData(data)
                    setFormTitle(`${action} - ${e.data.hotelName}`)
                }else{
                    const createObjectFromKeys = (keysArray) => {
                        return keysArray.reduce((obj, key) => {
                          obj[key] = '';
                          return obj;
                        }, {});
                      };                      
                    const newForm = createObjectFromKeys(Object.keys(form_InputLabels[0]));
                      
                    setInputData([newForm])
                    setHotelId(null);
                    setFormTitle(`${action} Hotel`) 
                }
                setFormMode(action)
                setIsSignInOpen(true)
            }
    }

    const addImagesHanlder = (e) => {
        setHotelName(e.data.hotelName);
        setHotelId(e.data.hotelId)
        setIsImagesOpen(true)
    }
    // grid action button
    const CustomButtonComponent = (props) => {
        return (<>
            <Button onClick={actionHandler} props={props} mode={'Edit'} icon={<FontAwesomeIcon icon={faPencil} />} iconColor={'text-green-800'} />
            <Button onClick={actionHandler} props={props} mode={'View'} icon={<FontAwesomeIcon icon={faEye} />} iconColor={'text-blue-500'}/>
            <Button onClick={actionHandler} props={props} mode={'delete'} icon={<FontAwesomeIcon icon={faTrash} />} iconColor={'text-red-500'} />
            <Button onClick={addImagesHanlder} props={props} mode={'images'} icon={<FontAwesomeIcon icon={faImages} />} iconColor={'text-orange-500'} />            
        </>
        )
    };
    // grid column names
    const colDefs = useMemo(()=>[
        { field: "hotelId", headerName: "Hotel Id", flex: 1, sortable: true, filter: true },
        { field: "hotelName", headerName: "Hotel Name", flex: 2, sortable: true, filter: true },
        { field: "hoteltype", headerName: "Hotel Type", flex: 1, sortable: true, filter: true },
        { field: "city", headerName: "City", flex: 1, sortable: true, filter: true },
        { field: "state", headerName: "State", flex: 1, sortable: true, filter: true },
        { field: "country", headerName: "Country", flex: 1, sortable: true, filter: true },
        { field: "address", headerName: "Address", flex: 2, sortable: true, filter: true },
        { field: "amenity", headerName: "Amenity", flex: 2, sortable: true, filter: true },
        { field: "Action", headerName: "Action", cellRenderer: CustomButtonComponent }
    ], []);

    
    
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchHotels(pageConfig));            
        };
        fetchData();
    }, [dispatch, pageConfig]);

    useEffect(() => {
        dispatch(getListData());
    }, []);

    const updatePageConfig = (updates) => {
        setPageConfig((prevConfig) => ({ ...prevConfig, ...updates }));
    };

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };

    const onSortChanged = (params) => {
        const sortModel = params.api.sortController.getSortModel()
        if(sortModel.length) updatePageConfig({...pageConfig, orderBy: sortModel});          
    };

    const onFilterChanged = (params) => {
        const filterModel = params.api.getFilterModel()
        updatePageConfig({...pageConfig, filter: filterModel})
    };

    const PaginationChangedEvent = useCallback((params, page) => {
        updatePageConfig({...pageConfig, offset: (params.paginationGetPageSize() * page) + 1})
    }, []);

    // cleanup API reference
    useEffect(() => {
        const apiInstance = gridApiRef;
        return () => {
            if (apiInstance) apiInstance.destroy();
        };
    }, [gridApiRef]);


    useEffect(()=>{
        setRowData(hotelsData.results)
    },[hotelsData])

    const closeModals = () => {
        setIsSignInOpen(false);
        setIsImagesOpen(false)
    };

    const onSubmit = async (data) => {
        const mode = formMode == 'Add' ? 'add' : formMode == 'Edit' ? 'update' : 'view';
        mode != 'Add' ? data.fields[0]['hotelId'] = hotelId : data.fields[0]['hotelId'] = null;
        const amenity = data.fields[0].amenity.join(',')
        
        data.fields[0].amenity = getList.amenities.filter(res=>amenity.includes(res.name));
        data.fields[0].hoteltype = getList.hotelTypes.filter(res=>res.name==data.fields[0].hoteltype);
        const updatedData = data?.fields[0];
        await serviceCall(updatedData, mode)
        
    };

    const serviceCall = async(data, mode) =>{
        mode == 'delete' ? await dispatch(addHotels({'hotelId': data.hotelId}, mode)) : await dispatch(addHotels(data, mode));
        await dispatch(fetchHotels(pageConfig));
        setIsSignInOpen(false);
    }

      
    if(hotelsData.total==0) return <div className='flex justify-center'>Loading...</div>

    
    return (
        <div>
            <div className='flex justify-between w-full'>
                <h2 className="text-lg font-semibold mb-4">Hotels Bids</h2>
                <Button onClick={actionHandler} title={'Add new'} mode={'Add'} icon={<FontAwesomeIcon icon={faPlus} />} iconColor={'text-green-900'} />
            </div>
            <div className="overflow-x-auto">
                {hotelsData.total > 0 && (
                    <>
                    <div
                    className="ag-theme-quartz"
                    style={{ height: 400 }}
                   >
                    <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            onGridReady={onGridReady}
                            onSortChanged={onSortChanged}
                            onFilterChanged={onFilterChanged}
                            paginationPageSize={10}
                            />
                            </div>

                    {gridApiRef && (
                    <CustomPagination
                        api={gridApiRef}
                        totalRecords={hotelsData.total}
                        pageSize={10}
                        click={PaginationChangedEvent}
                    />
                    )}
                    </>
                    
                )}
            </div>
            {isSignInOpen && (
                <Modal formTitle={formTitle} closeModal={closeModals}>
                    <Formik inputValue={inputData} amenityList={getList} closeModal={closeModals} inputLabels={form_InputLabels} onSubmit={onSubmit} />
                </Modal>
            )}
            {isImagesOpen && (
                <Modal closeModal={closeModals}>
                    <ImageUploadForm hotelId={hotelId} hotelName={hotelName} closeModal={closeModals} useInPage={'hotel'} />
                </Modal>
            )}
        </div>
    )
}

export default Hotels