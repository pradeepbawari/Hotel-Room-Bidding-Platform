const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file

const pool = mysql.createPool(dbConfig);

exports.getListHotelToDb = async (pagination) => {
    const { limit, offset, orderBy, filters } = pagination;
    let colName=null;
    let colValue = null
    if(filters != null && Object.entries(filters).length > 0){
        const filterKey = Object.keys(filters);
        colName = toMatchKeyWithTable(filterKey[0])
        colValue = `"%${filters[filterKey[0]].filter}%"`
        console.log(colName, colValue);
    }else{
        colName = orderBy[0].colId == 'hotelId' ? 'hotel_id' : orderBy[0].colId;
    }

    const sortDirection = (orderBy?.[0]?.sort) ? orderBy[0].sort : 'ASC';
    
    const query = `SELECT 
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
WHERE 
    ${colValue} IS NULL OR Hotel.${colName} LIKE ${colValue}          
GROUP BY
    Hotel.hotel_id
ORDER BY 
        Hotel.${colName} ${sortDirection}
        LIMIT ? OFFSET ?`;
        const [rows] = await pool.execute(query, [limit, offset]);
        
        return rows;        
};

exports.totalCountHotels = async () => {
    const query = `SELECT COUNT(*) AS total_rows FROM Hotel`;
        const [rows] = await pool.execute(query);
        return rows;        
};

// get hotel by id

exports.getHotelByIdToDb = async (pagination) => {
    const { hotelId, limit, offset } = pagination;
    const query = `SELECT 
    Room.room_id,
    Room.price_per_night,
    Room.room_type,
    Room.room_number,
    Room.start_date,
    Room.end_date,
    Room.room_id,
    Room.capacity,
    Room.hotel_id,
    Room.status,
    Hotel.hotel_name,
    Hotel.address,
    Hotel.city,
    Hotel.state,
    Hotel.country,
    GROUP_CONCAT(DISTINCT hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype,
    GROUP_CONCAT(DISTINCT amenity.name ORDER BY amenity.name SEPARATOR ', ') AS amenity,
    (
        SELECT COUNT(DISTINCT r.room_id)
        FROM Room AS r
        WHERE r.status = 0 AND r.hotel_id = Room.hotel_id
    ) AS inactiveRoomCount
FROM
    Room
    LEFT JOIN 
        hotelamenity ON Room.hotel_id = hotelamenity.hotel_id
    LEFT JOIN 
        amenity ON amenity.amenity_id = hotelamenity.amenity_id
    LEFT JOIN 
        hotelcategory ON Room.hotel_id = hotelcategory.hotel_id
    LEFT JOIN 
        hoteltype ON hoteltype.type_id = hotelcategory.type_id
    LEFT JOIN 
        hotel ON hotel.hotel_id = room.hotel_id
WHERE Room.hotel_id = ?    
GROUP BY
    Room.hotel_id LIMIT ? OFFSET ?`;
        const [rows] = await pool.execute(query, [hotelId, limit, offset]);
        return rows;
};

exports.getRoomDealPrice = async (hotelId) => {
    
    const query = `SELECT 
        roomdeal.deal_id, 
        roomdeal.room_id, 
        roomdeal.travel_agent_id, 
        roomdeal.deal_price, 
        roomdeal.deal_date,
        travelagent.agent_name 
    FROM roomdeal 
        LEFT JOIN travelagent ON roomdeal.travel_agent_id = travelagent.travel_agent_id
    WHERE hotel_id = ?`
    const [rows] = await pool.execute(query, [hotelId]);
    return [rows];
}

exports.getUpdateRoomDealPrice = async (hotelId, roomId) => {
    
    const query = `SELECT 
        roomdeal.deal_id, 
        roomdeal.room_id, 
        roomdeal.travel_agent_id, 
        roomdeal.deal_price, 
        roomdeal.deal_date,
        travelagent.agent_name 
    FROM roomdeal 
        LEFT JOIN travelagent ON roomdeal.travel_agent_id = travelagent.travel_agent_id
    WHERE roomdeal.hotel_id = ? AND roomdeal.room_id = ?`
    const [rows] = await pool.execute(query, [hotelId, roomId]);
    return [rows];
}

exports.getUpdateHotelDealPrice = async (hotelId) => {
    
    const query = `SELECT 
        hoteldeal.deal_id, 
        hoteldeal.travel_agent_id, 
        hoteldeal.deal_price, 
        hoteldeal.deal_date,
        travelagent.agent_name 
    FROM hoteldeal 
        LEFT JOIN travelagent ON hoteldeal.travel_agent_id = travelagent.travel_agent_id
    WHERE hoteldeal.hotel_id = ?`
    const [rows] = await pool.execute(query, [hotelId]);
    return [rows];
}

// get hotel categoy
const getHotelCategoriesToDb = async () => {
    const query = `SELECT 
    hoteltype.type_id,
    hoteltype.name
FROM
    hoteltype`
        const [rows] = await pool.execute(query);
        return rows;        
};

// get room categoy
const getroomCategoriesToDb = async () => {
    const query = `SELECT 
    roomtype.type_id,
    roomtype.name
FROM
    roomtype`
        const [rows] = await pool.execute(query);
        return rows;        
};

// get hotel amenity
exports.getHotelAmenityToDb = async () => {
    const query = `SELECT 
    amenity.amenity_id,
    amenity.name
FROM
    amenity`
    const type = await getHotelCategoriesToDb()
    const roomtype = await getroomCategoriesToDb()
    const [rows] = await pool.execute(query);        
        return {
            amenities : rows,
            hotelTypes : type,
            roomTypes: roomtype
        };        
};

exports.addHotelTypeToDb = async (newHotel) => {
    const {hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website } = newHotel;
    
    const query = 'INSERT INTO Hotel (hotel_name, address, city, state, country, postal_code, phone_number, contact_person, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website]);
    return rows;
};


//  delete hotel and other table also one by one

exports.hotelamenityDel = async(hotelId) => {
    const delQuery = `DELETE FROM hotelamenity WHERE hotel_id = ?`;
    await pool.execute(delQuery, [parseInt(hotelId)]);
}

exports.roomamenityDel = async(roomId) => {
    const delQuery = `DELETE FROM roomamenity WHERE room_id = ?`;
    await pool.execute(delQuery, [parseInt(roomId)]);
}

exports.delQueryhotelcategoryDel = async(hotelId) => {
    const delQuery = `DELETE FROM hotelcategory WHERE hotel_id = ?`;
    await pool.execute(delQuery, [parseInt(hotelId)]);
}

exports.delQueryroomcategoryDel = async(roomId) => {
    const delQuery = `DELETE FROM roomcategory WHERE room_id = ?`;
    await pool.execute(delQuery, [parseInt(roomId)]);
}

exports.delQueryhotelImages = async(hotelId) => {
    const delQuery = `DELETE FROM hotelimagesw WHERE hotel_id = ?`;
    await pool.execute(delQuery, [parseInt(hotelId)]);
}

exports.updateAmenitiesToDb = async (hotelId, amenity, hoteltype) => {
    
    await this.hotelamenityDel(hotelId);

    const insertQuery = `INSERT INTO hotelamenity (hotel_id, amenity_id) VALUES (?, ?)`;
    const promises = amenity.map(res => pool.execute(insertQuery, [parseInt(hotelId), parseInt(res.amenityId)]));

    await this.delQueryhotelcategoryDel(hotelId)

    const insertQueryhotelcategory = `INSERT INTO hotelcategory (hotel_id, type_id) VALUES (?, ?)`;
    const promises2 = hoteltype.map(res => pool.execute(insertQueryhotelcategory, [parseInt(hotelId), parseInt(res.typeId)]));

    await Promise.all(promises, promises2);

    return { message: "Amenities updated successfully" };
};

exports.updateRoomAmenitiesToDb = async (roomId, amenities, roomtype) => {
    await this.roomamenityDel(roomId);
    
    const insertQuery = `INSERT INTO roomamenity (room_id, amenity_id) VALUES (?, ?)`;
    const promises = amenities.map(res => pool.execute(insertQuery, [parseInt(roomId), parseInt(res.amenityId)]));
    
    await this.delQueryroomcategoryDel(roomId)
    const insertQueryhotelcategory = `INSERT INTO roomcategory (room_id, type_id) VALUES (?, ?)`;
    const promises2 = roomtype.map(res => pool.execute(insertQueryhotelcategory, [parseInt(roomId), parseInt(res.typeId)]));
    
    await Promise.all(promises, promises2);

    return { message: "Room Amenities updated successfully" };
};

exports.addRoomAmenitiesToDb = async (roomId, amenities, roomtype) => {
    
    const insertQuery = `INSERT INTO roomamenity (room_id, amenity_id) VALUES (?, ?)`;
    const promises = amenities.map(res => pool.execute(insertQuery, [parseInt(roomId), parseInt(res.amenityId)]));

    const insertQueryhotelcategory = `INSERT INTO roomcategory (room_id, type_id) VALUES (?, ?)`;
    const promises2 = roomtype.map(res => pool.execute(insertQueryhotelcategory, [parseInt(roomId), parseInt(res.typeId)]));

    await Promise.all(promises, promises2);

    return { message: "Amenities updated successfully" };
};

exports.addAmenitiesToDb = async (hotelId, amenity, hoteltype) => {
    
    const insertQuery = `INSERT INTO hotelamenity (hotel_id, amenity_id) VALUES (?, ?)`;
    const promises = amenity.map(res => pool.execute(insertQuery, [parseInt(hotelId), parseInt(res.amenityId)]));

    const insertQueryhotelcategory = `INSERT INTO hotelcategory (hotel_id, type_id) VALUES (?, ?)`;
    const promises2 = hoteltype.map(res => pool.execute(insertQueryhotelcategory, [parseInt(hotelId), parseInt(res.typeId)]));

    await Promise.all(promises, promises2);

    return { message: "Amenities updated successfully" };
};

const multer = require('multer');
const path = require('path');
const { toMatchKeyWithTable } = require('../core/utiles');

// Define storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Print the request body for debugging
        console.log(req.body, 'sssssss');

        // Construct the upload path
        const uploadPath = path.join(__dirname, '../../frontend/src/assets', 'uploads');
        
        // Pass the constructed path to the callback
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Use the current timestamp and the original file extension for the filename
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Initialize multer with the storage configuration
exports.upload = multer({ storage: storage });