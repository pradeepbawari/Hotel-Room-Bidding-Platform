import React, { useEffect, useState } from 'react';
import { fetchHotelImage } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const ImageUploadForm = ({hotelId, hotelName, closeModal, useInPage, roomId, roomType}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const dispatch = useDispatch();
    const hotelsData = useSelector((state) => state.fetchImages.fetchImages);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const imageData = new FormData();
        
        Array.from(selectedFiles).forEach((file, index) => {
            imageData.append(`images`, file);
        });
        
        imageData.append('hotelId', hotelId)
        imageData.append('hotelName', hotelName)
        imageData.append('userInPage', useInPage)
        imageData.append('roomId', roomId)    
        imageData.append('roomType', roomType)        

        try {
            await dispatch(fetchHotelImage(imageData, 'add'));            
        } catch (error) {
            console.error('Error uploading images:', error);
        }
        closeModal();
    };

    const deleteHandler = async (id) => {
        await dispatch(fetchHotelImage({id: id}, 'delete'))
        await dispatch(fetchHotelImage({id: id}, 'delete'))
    }
    
    useEffect(()=>{
        dispatch(fetchHotelImage({hotelId: hotelId}, 'list'))
    },[dispatch])
    

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] overflow-auto my-10 p-6 relative rounded-lg">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">Close</button>
            <h2 className="text-2xl font-bold mb-6 text-center">{hotelName}</h2>

                <ul className='flex'>
                    {hotelsData && hotelsData.length && hotelsData.map((res)=>(
                        <>
                        {res.imageSize == 'small' &&
                            <li key={res.id} className='flex justify-between mb-2 mr-2 text-sm text-white'> 
                                <img src={`http://localhost:5174/${res.imagePath}`} className='img-height' /> 
                                <button className='bg-red-700 px-2 py-0 rounded-sm' onClick={(e)=>deleteHandler(res.id)}>Del</button>
                            </li>
                        }
                        </>
                    ))}
                </ul>                

                <form onSubmit={handleSubmit}>
                    <input type="file" multiple onChange={handleFileChange} required />
                    <input className='mt-10 bg-red-500 w-full float-right py-2 px-2 text-white' type="submit" value={'upload images'} />
                </form>
            </div>
        </div>
    );
};

export default ImageUploadForm;
