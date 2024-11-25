const { transformKeysToCamelCase } = require("../core/utiles");
const { getHotelAmenityListService } = require("../services/getListService");

const getHotelAmenityList = async (req, res) => {
    const data = {amenities: null, hotelTypes: null, roomTypes: null}
    try {
        const result = await getHotelAmenityListService();
        data.amenities = result.amenities.map(item => transformKeysToCamelCase(item));
        data.hotelTypes = result.hotelTypes.map(item => transformKeysToCamelCase(item));
        data.roomTypes = result.roomTypes.map(item => transformKeysToCamelCase(item));
        
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel RoomBid details:', err);
        return res.status(500).send('Server connection error');
    }
}

module.exports = { getHotelAmenityList}