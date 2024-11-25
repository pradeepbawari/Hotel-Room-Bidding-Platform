const { getHotelAmenityListServiceToDb } = require("../models/getListModel");

exports.getHotelAmenityListService = async () => {
    try {
        const roomBidDetails = await getHotelAmenityListServiceToDb();
        return roomBidDetails;
    } catch (err) {
        throw new Error('Error fetching RoomBid details from the database');
    }
};