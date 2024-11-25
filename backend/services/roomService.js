
const { deleteRoomToDb, addRoomToDb, updateRoomToDb, listRoomToDb, listRoomByHotelToDb } = require('../models/roomModel')

exports.addRoomService = async (newRoom) => {
    try {
        const roomDetails = await addRoomToDb(newRoom);
        return roomDetails.length > 0 ? roomDetails : null;
    } catch (err) {
        throw new Error('Error fetching room details from the database');
    }
};

exports.deleteRoomService = async (roomHotelId) => {

    try {
        const roomDetails = await deleteRoomToDb(roomHotelId);
        return roomDetails.length > 0 ? roomDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.updateRoomService = async (updateRoom) => {

    try {
        const roomDetails = await updateRoomToDb(updateRoom);
        return roomDetails.length > 0 ? roomDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.listRoomService = async (pagination) => {

    try {
        const roomDetails = await listRoomToDb(pagination);
        return roomDetails.length > 0 ? roomDetails : [];
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

