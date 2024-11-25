
const { searchDb, searchLoc, searchHotal, searchHotelPage, searchHotelRoomPage } = require('../models/searchModel');

exports.searchService = async (str) => {
    try {
        const roomDetails = await searchDb(str);
        return roomDetails.length > 0 ? roomDetails : null;
    } catch (err) {
        throw new Error('Error fetching room details from the database');
    }
};

exports.searchLocService = async (str) => {
    try {
        const roomDetails = await searchLoc(str);
        return roomDetails.length > 0 ? roomDetails : null;
    } catch (err) {
        throw new Error('Error fetching room details from the database');
    }
};

exports.searchHotelService = async (str) => {
    try {
        const searchHotelDetails = await searchHotal(str);
        return searchHotelDetails.length > 0 ? searchHotelDetails : null;
    } catch (err) {
        throw new Error('Error fetching search Hotel details from the database');
    }
};

exports.searchHotelPageService = async (str) => {
    try {
        const searchHotelDetails = await searchHotelPage(str);
        console.log(searchHotelDetails, 'fafadfadfa');
        
        return searchHotelDetails.length > 0 ? searchHotelDetails : [];
    } catch (err) {
        throw new Error('Error fetching search Hotel details from the database');
    }
};

exports.searchHotelRoomPageService = async (str) => {
    try {
        const searchHotelRoomDetails = await searchHotelRoomPage(str);
        console.log(searchHotelRoomDetails, 'fafadfadfa');
        
        return searchHotelRoomDetails.length > 0 ? searchHotelRoomDetails : [];
    } catch (err) {
        throw new Error('Error fetching search Hotel details from the database');
    }
};