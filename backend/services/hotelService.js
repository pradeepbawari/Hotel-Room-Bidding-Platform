const { deleteHotelToDb, addHotelToDb, updateHotelToDb, listHotelToDb } = require('../models/hotelModel')

exports.addHotelService = async (newHotel) => {
    try {
        const hotelDetails = await addHotelToDb(newHotel);
        return hotelDetails.length > 0 ? hotelDetails : null;
    } catch (err) {
        throw new Error('Error fetching room details from the database');
    }
};

exports.deleteHotelService = async (hotelId) => {

    try {
        const hotelDetails = await deleteHotelToDb(hotelId);
        return hotelDetails.length > 0 ? hotelDetails : null;
    } catch(err){
        throw new Error('Error delete hotel by id service page');
    }
};

exports.updateHotelService = async (updateHotel) => {

    try {
        const hotelDetails = await updateHotelToDb(updateHotel);
        return hotelDetails.length > 0 ? hotelDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.listHotelService = async (pagination) => {

    try {
        const hotelList = await listHotelToDb(pagination);
        return hotelList.total > 0 ? hotelList : null;
    } catch(err){
        throw new Error('Error fetching hotel in hotelService page');
    }
};

exports.getHotelImagesService = async (pagination) => {

    try {
        const hotelImages = await getHotelImagesServiceToDb(pagination);
        return hotelImages.length > 0 ? hotelImages : null;
    } catch(err){
        throw new Error('Error fetching hotel images from the database');
    }
};