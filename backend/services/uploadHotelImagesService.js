const { addHotelImagesDb, listHotelImagesDb, deleteHotelImagesDb } = require("../models/uploadHotelImagesModel");

exports.uploadHotelImagesService = async (filePath, data) => {
    try {
        const auth = await addHotelImagesDb(filePath, data);
        return auth.length > 0 ? auth : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.uploadHotelImagesListService = async (hotelId) => {
    try {
        const auth = await listHotelImagesDb(hotelId);
        return auth.length > 0 ? auth : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.deleteHotelImagesService = async (id) => {
    try {
        const auth = await deleteHotelImagesDb(id);
        return auth.length > 0 ? auth : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};