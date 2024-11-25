
const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file

const pool = mysql.createPool(dbConfig);

exports.searchDb = async (searchStr) => {
    
    const query = `SELECT city, state 
                       FROM hotel 
                       WHERE city LIKE ? OR state LIKE ? 
                       LIMIT 30`;
        const searchTerm = `%${searchStr}%`;
        const [rows] = await pool.execute(query, [searchTerm, searchTerm]);
    return rows;
};

exports.searchLoc = async (searchStr) => {
    const {address, type} = searchStr;
    const query = `SELECT address 
                       FROM hotel
                       WHERE address LIKE ? 
                       LIMIT 30`;
        const searchTerm = `%${address}%`;
        const [rows] = await pool.execute(query, [searchTerm]);
        
    return rows;
};

exports.searchHotal = async (searchStr) => {
    const {hotelName, address, type} = searchStr;
    const query = `SELECT hotel_name 
                       FROM hotel
                       WHERE hotel_name LIKE ? 
                       LIMIT 30`;
        const searchTerm = `%${hotelName}%`;
        const [rows] = await pool.execute(query, [searchTerm]);
        
    return rows;
};

exports.searchHotelPage = async (searchStr) => {
    const { address, hotelName, type, limit = 200 } = searchStr;
    let query = `
        SELECT 
    Hotel.hotel_id,
    Hotel.hotel_name,
    Hotel.address,
    Hotel.city,
    Hotel.state,
    Hotel.country,
    Hotel.postal_code,
    Hotel.phone_number,
    Hotel.contact_person,
    Hotel.email,
    Hotel.website,
    Hotel.price_per_night,
    GROUP_CONCAT(DISTINCT hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype,
    GROUP_CONCAT(DISTINCT amenity.name ORDER BY amenity.name SEPARATOR ',') AS amenity    
FROM
    Hotel
    LEFT JOIN 
        hotelcategory ON Hotel.hotel_id = hotelcategory.hotel_id
    LEFT JOIN 
        hoteltype ON hoteltype.type_id = hotelcategory.type_id
    LEFT JOIN 
        hotelamenity ON Hotel.hotel_id = hotelamenity.hotel_id
    LEFT JOIN 
        amenity ON amenity.amenity_id = hotelamenity.amenity_id
    LEFT JOIN 
        hotelimages ON hotelimages.hotel_id = Hotel.hotel_id
    `;

    const conditions = [];
    const queryParams = [];

    const filters = [
        { field: "address", value: address },
        { field: "hotel_Name", value: hotelName },
        { field: "hoteltype.name", value: type },
    ];

    filters.forEach(({ field, value }) => {
        if (value && value !== "null") {
          conditions.push(`${field} = ?`);
          queryParams.push(value);
        }
    });
      
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
    }

    query += `
        GROUP BY 
            Hotel.hotel_id
        ORDER BY 
            Hotel.hotel_id ASC
        LIMIT ?;
    `;
    queryParams.push(parseInt(limit));
    
    const [rows] = await pool.execute(query, queryParams);
    return rows;
};

exports.searchHotelRoomPage = async (searchStr) => {
   // console.log(searchStr, 'jjjjjjjjjj');
    
    const { address, hotelName, type, roomType, limit = 200 } = searchStr;
    let query = `
        SELECT 
            Room.room_id,
            Room.price_per_night,
            Room.room_number,
            Room.start_date,
            Room.end_date,
            Room.capacity,
            Hotel.hotel_id,
            Hotel.hotel_name,
            GROUP_CONCAT(Amenity.name ORDER BY Amenity.name SEPARATOR ',') AS amenities,
            GROUP_CONCAT(DISTINCT roomtype.name ORDER BY roomtype.name SEPARATOR ', ') AS roomtype
        FROM
            Room
        LEFT JOIN
            RoomAmenity ON Room.room_id = RoomAmenity.room_id
        LEFT JOIN
            Amenity ON Amenity.amenity_id = RoomAmenity.amenity_id
        LEFT JOIN 
            roomcategory ON Room.room_id = roomcategory.room_id
        LEFT JOIN 
            roomtype ON roomtype.type_id = roomcategory.type_id
        LEFT JOIN 
            Hotel ON Room.hotel_id = Hotel.hotel_id`;

    const conditions = [];
    const queryParams = [];

    const filters = [
        { field: "address", value: address },
        { field: "hotel_Name", value: hotelName },
        { field: "hoteltype.name", value: type },
        { field: "roomtype.name", value: roomType}
    ];

    filters.forEach(({ field, value }) => {
        if (value && value !== "null") {
          conditions.push(`${field} = ?`);
          queryParams.push(value);
        }
    });
      
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
    }

    query += `
        GROUP BY 
           Room.room_id 
        LIMIT ?;
    `;
    queryParams.push(parseInt(limit));
    //console.log(query);
    
    const [rows] = await pool.execute(query, queryParams);
    return rows;
};
