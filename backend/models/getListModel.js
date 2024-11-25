const { getHotelAmenityToDb } = require("./utilesModel");

exports.getHotelAmenityListServiceToDb = async () => {
    const rows = await getHotelAmenityToDb();
    return rows;
}