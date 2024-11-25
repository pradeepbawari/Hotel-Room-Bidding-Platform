
const { deleteRoomBidToDb, addRoomBidToDb, updateRoomBidToDb, listRoomBidToDb, bidRoomByHotelToDb, bidByHotelToDb, addHotelBidToDb, updateHotelBidToDb } = require('../models/bidRoomModel')

exports.addRoomBidService = async (newRoomBid) => {
    try {
        const roomBidDetails = await addRoomBidToDb(newRoomBid);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch (err) {
        throw new Error('Error fetching RoomBid details from the database');
    }
};

exports.deleteRoomBidService = async (roomBidHotelId) => {

    try {
        const roomBidDetails = await deleteRoomBidToDb(roomBidHotelId);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch(err){
        throw new Error('Error fetching RoomBid details from the database');
    }
};

exports.updateRoomBidService = async (updateRoomBid) => {

    try {
        const roomBidDetails = await updateRoomBidToDb(updateRoomBid);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch(err){
        throw new Error('Error fetching RoomBid details from the database');
    }
};

exports.listRoomBidService = async (pagination) => {

    try {
        const roomBidDetails = await listRoomBidToDb(pagination);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch(err){
        throw new Error('Error fetching RoomBid details from the database');
    }
};

exports.bidByRoomService = async (pagination) => {

    try {
        const roomDetails = await bidRoomByHotelToDb(pagination);
        return (roomDetails.hotelData && roomDetails.roomData.length) > 0 ? roomDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

// hotel bid service

exports.bidByHotelService = async (pagination) => {

    try {
        const roomDetails = await bidByHotelToDb(pagination);
        return roomDetails.hotelData ? roomDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.addHotelBidService = async (newRoomBid) => {
    try {
        const roomBidDetails = await addHotelBidToDb(newRoomBid);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch (err) {
        throw new Error('Error fetching RoomBid details from the database');
    }
};

exports.updateHotelBidService = async (updateRoomBid) => {

    try {
        const roomBidDetails = await updateHotelBidToDb(updateRoomBid);
        return roomBidDetails.length > 0 ? roomBidDetails : null;
    } catch(err){
        throw new Error('Error fetching RoomBid details from the database');
    }
};