
const { transformKeysToCamelCase } = require('../core/utiles');
const { addRoomBidService, deleteRoomBidService, updateRoomBidService, listRoomBidService, bidByRoomService, bidByHotelService, addHotelBidService, updateHotelBidService } = require('../services/bidRoomService');

const addRoomBid = async (req, res) => {
    
    try {
        const newRoomBid = req.body;
        const result = await addRoomBidService(newRoomBid);        
        let data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch (err) {
        console.error('Error fetching add travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
};

const deleteRoomBid = async (req, res) => {

    try {
        const roomBidHotelId = req.body;
        const result = await deleteRoomBidService(roomBidHotelId);
        return res.status(200).send({results: 'RoomBid successfully deleted', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
}

const updateRoomBid = async (req, res) => {

    try {
        const updateRoomBid = req.body;
        const result = await updateRoomBidService(updateRoomBid);
        let data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
}

const listRoomBid = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await listRoomBidService(pagination);
        let data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
}

const bidByrooms = async (req, res) => {
    let data = {hotelData:null, roomData:null, roomDealDetail:null}

    try {
        const pagination = req.body;
        const result = await bidByRoomService(pagination);
        if(result?.roomData.length) data.roomData = result.roomData.map(item => transformKeysToCamelCase(item));
        if(result?.hotelData) data.hotelData = transformKeysToCamelCase(result?.hotelData);
        if(result?.roomDealDetail) data.roomDealDetail = result.roomDealDetail.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
}

const bidByHotel = async (req, res) => {
    let data = {hotelData:null, hotelDealDetail:null}

    try {
        const pagination = req.body;
        const result = await bidByHotelService(pagination);
        if(result?.hotelData) data.hotelData = transformKeysToCamelCase(result?.hotelData[0]);
        if(result?.hotelDealDetail) data.hotelDealDetail = result.hotelDealDetail.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
}

const addbidbyhotel = async (req, res) => {

    try {
        const newRoomBid = req.body;
        const result = await addHotelBidService(newRoomBid);        
        let data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch (err) {
        console.error('Error fetching add travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
};

const updateBidbyhotel = async (req, res) => {

    try {
        const updateRoomBid = req.body;
        const result = await updateHotelBidService(updateRoomBid);
        let data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
}

module.exports = { addRoomBid, deleteRoomBid, updateRoomBid, listRoomBid, bidByrooms, bidByHotel, addbidbyhotel, updateBidbyhotel }
