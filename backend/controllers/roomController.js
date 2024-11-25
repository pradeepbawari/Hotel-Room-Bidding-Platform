
const { transformKeysToCamelCase } = require('../core/utiles');
const { addRoomService, deleteRoomService, updateRoomService, listRoomService, listRoomByHotelService } = require('../services/roomService');

const addRoom = async (req, res) => {
    
    try {
        const newRoom = req.body;
        const result = await addRoomService(newRoom);        
        return res.status(200).send({ results: 'Room successfully added', status: 200 });
    } catch (err) {
        console.error('Error fetching add travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
};

const deleteRoom = async (req, res) => {

    try {
        const roomHotelId = req.body;
        const result = await deleteRoomService(roomHotelId);
        return res.status(200).send({results: 'Room successfully deleted', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
}

const updateRoom = async (req, res) => {

    try {
        const updateRoom = req.body;
        const result = await updateRoomService(updateRoom);
        return res.status(200).send({results: 'Room successfully update', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
}

const listRoom = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await listRoomService(pagination);
        const modifyData = result.map(item => {
            if (item.amenities != null && item.amenities !== '') {
              return {
                ...item,
                amenities: item.amenities.split(','),
                roomtype: item.roomtype.split(',')
              };
            }
            return item;
        });
        const data = modifyData.map(item=>transformKeysToCamelCase(item))
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
}

module.exports = { addRoom, deleteRoom, updateRoom, listRoom}