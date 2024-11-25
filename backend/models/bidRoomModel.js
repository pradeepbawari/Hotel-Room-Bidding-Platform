
const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file
const { getHotelByIdToDb, getRoomDealPrice, getUpdateRoomDealPrice, getUpdateHotelDealPrice } = require('./utilesModel');

const pool = mysql.createPool(dbConfig);

exports.addRoomBidToDb = async (newRoomBid) => {
    const {roomId, travelAgentId, dealDate, dealPrice, hotelId } = newRoomBid;
    
    const query = 'INSERT INTO roomdeal (room_id, travel_agent_id, deal_date, deal_price, hotel_id) VALUES (?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [roomId, travelAgentId, dealDate, dealPrice, hotelId]);
    const [roomDealPriceList] = await getUpdateRoomDealPrice(hotelId, roomId)
    return roomDealPriceList;
};

exports.deleteRoomBidToDb = async (roomBidHotelId) => {
    const {dealId} = roomBidHotelId;
    const query = `DELETE FROM roomdeal WHERE deal_id = ? `;
    const [rows] = await pool.execute(query, [dealId]);
    return rows;
};

exports.updateRoomBidToDb = async (updateRoomBid) => {
    const {dealDate, dealPrice, dealId, roomId, travelAgentId, hotelId } = updateRoomBid;
    
    const query = `UPDATE roomdeal 
    SET deal_date = ?, deal_price = ? 
        
    WHERE deal_id = ? AND room_id = ? AND travel_agent_id = ?`;

    const [rows] = await pool.execute(query, [dealDate, dealPrice, dealId, roomId, travelAgentId]);
    const [roomDealPriceList] = await getUpdateRoomDealPrice(hotelId, roomId)
    return roomDealPriceList;
};

exports.listRoomBidToDb = async (pagination) => {
    const { roomId, limit, offset } = pagination;
    
    const query = `SELECT
        roomdeal.deal_id,
        roomdeal.deal_price,
        roomdeal.deal_date,
        TravelAgent.travel_agent_id,
        TravelAgent.agent_name,
        TravelAgent.email,
        TravelAgent.phone_number,
        Room.room_id,
        Room.room_number,
        Room.room_type,
        Room.price_per_night,
        roomdeal.room_id
    FROM
        roomdeal
    INNER JOIN
        TravelAgent ON roomdeal.travel_agent_id = TravelAgent.travel_agent_id
    INNER JOIN
        Room ON roomdeal.room_id = Room.room_id
     WHERE roomdeal.room_id = ? LIMIT ? OFFSET ?`;
    const [rows] = await pool.execute(query, [roomId, limit, offset]);
    return rows;
};

exports.bidRoomByHotelToDb = async (pagination) => {
    const { hotelId, roomId, limit, offset } = pagination;
    // console.log(pagination, 'jjjjjjj');
    
    
    const query = `SELECT 
    Room.room_id,
    Room.price_per_night,
    Room.room_type,
    Room.room_number,
    Room.start_date,
    Room.end_date,
    Room.room_id,
    Room.capacity,
    Room.bid_num_room,    
    GROUP_CONCAT(Amenity.name ORDER BY Amenity.name SEPARATOR ', ') AS amenities
FROM
    Room
LEFT JOIN
    RoomAmenity ON Room.room_id = RoomAmenity.room_id
LEFT JOIN
    Amenity ON Amenity.amenity_id = RoomAmenity.amenity_id
WHERE 
    Room.room_id = ?
GROUP BY
    Room.room_id LIMIT ? OFFSET ?`;
    const [hotel] = await getHotelByIdToDb(pagination)
    const [roomDealPriceList] = await getRoomDealPrice(pagination.hotelId)
    const [rows] = await pool.execute(query, [roomId, limit, offset]);
    return {
        hotelData: hotel,
        roomDealDetail: roomDealPriceList, 
        roomData: rows        
    };
};


// hotel bid table data

exports.bidByHotelToDb = async (pagination) => {
    const { hotelId, limit, offset } = pagination;
    
    const query = `SELECT 
    Hotel.hotel_id,
    Hotel.hotel_name,
    Hotel.address,
    Hotel.city,
    Hotel.state,
    Hotel.country,
    Hotel.price_per_night,
    GROUP_CONCAT(DISTINCT hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype,
    GROUP_CONCAT(DISTINCT amenity.name ORDER BY amenity.name SEPARATOR ', ') AS amenity   
FROM
    hotel
    LEFT JOIN 
        hotelamenity ON hotel.hotel_id = hotelamenity.hotel_id
    LEFT JOIN 
        amenity ON amenity.amenity_id = hotelamenity.amenity_id
    LEFT JOIN 
        hotelcategory ON hotel.hotel_id = hotelcategory.hotel_id
    LEFT JOIN 
        hoteltype ON hoteltype.type_id = hotelcategory.type_id    
WHERE hotel.hotel_id = ?    
GROUP BY
    hotel.hotel_id`;
    const [rows] = await pool.execute(query, [hotelId]);
    const [hotelDealPriceList] = await getUpdateHotelDealPrice(pagination.hotelId)
    return {
        hotelData: rows,
        hotelDealDetail: hotelDealPriceList, 
    };
};

exports.addHotelBidToDb = async (newRoomBid) => {
    const {travelAgentId, dealDate, dealPrice, hotelId } = newRoomBid;
    console.log(newRoomBid);
    
    const query = 'INSERT INTO hoteldeal (travel_agent_id, deal_date, deal_price, hotel_id) VALUES (?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [travelAgentId, dealDate, dealPrice, hotelId]);
    const [roomDealPriceList] = await getUpdateHotelDealPrice(hotelId)
    return roomDealPriceList;
};

exports.updateHotelBidToDb = async (updateRoomBid) => {
    const {dealDate, dealPrice, dealId, travelAgentId, hotelId } = updateRoomBid;
    
    const query = `UPDATE hoteldeal 
    SET deal_date = ?, deal_price = ? 
        
    WHERE deal_id = ? AND travel_agent_id = ?`;

    const [rows] = await pool.execute(query, [dealDate, dealPrice, dealId, travelAgentId]);
    const [roomDealPriceList] = await getUpdateHotelDealPrice(hotelId)
    return roomDealPriceList;
};


// exports.bidRoomByHotelToDb = async (pagination) => {
//     const { roomId, limit, offset } = pagination;
    
//     const query = `SELECT 
//     Room.room_id,
//     Room.price_per_night,
//     Room.room_type,
//     Room.room_number,
//     Room.start_date,
//     Room.room_id,
//     Room.capacity,
//     GROUP_CONCAT(Amenity.name ORDER BY Amenity.name SEPARATOR ', ') AS amenities
// FROM
//     Room
// LEFT JOIN
//     RoomAmenity ON Room.room_id = RoomAmenity.room_id
// LEFT JOIN
//     Amenity ON Amenity.amenity_id = RoomAmenity.amenity_id
// WHERE 
//     Room.hotel_id = ? 
// GROUP BY
//     Room.room_id LIMIT ? OFFSET ?`;
//     const [rows] = await pool.execute(query, [roomId, limit, offset]);
//     return rows;
// };


