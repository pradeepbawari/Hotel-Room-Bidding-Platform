
const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file
const { getListHotelToDb, updateRoomAmenitiesToDb, addRoomAmenitiesToDb, roomamenityDel, delQueryroomcategoryDel } = require('./utilesModel');

const pool = mysql.createPool(dbConfig);

exports.addRoomToDb = async (newRoom) => {
    const {hotelId, roomNumber, capacity, pricePerNight, startDate, endDate, roomId, amenities, roomtype } = newRoom;
    
    const roomQuery = 'INSERT INTO Room (hotel_id, room_number, capacity, price_per_night, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)';
    // const amenityQuery = 'INSERT INTO roomamenity (room_id, amenity_id) VALUES (?, ?)';

    const [rows] = await pool.execute(roomQuery, [hotelId, roomNumber, capacity, pricePerNight, startDate, endDate]);
    rows.insertId != undefined && rows.insertId != null ? [{userId: rows.insertId}] : null;
    await addRoomAmenitiesToDb(rows.insertId, amenities, roomtype)
    
    return rows;
};

exports.deleteRoomToDb = async (roomHotelId) => {
    const {roomId} = roomHotelId;
    
    await roomamenityDel(roomId)
    await delQueryroomcategoryDel(roomId)
    // await delQueryhotelImages(hotelId)

    const query = `DELETE FROM Room WHERE room_id = ?`;
    const [rows] = await pool.execute(query, [parseInt(roomId)]);
    return rows;
};

exports.updateRoomToDb = async (updateRoom) => {
    const {roomNumber, roomtype, capacity, pricePerNight, startDate, endDate, roomId, hotelId, amenities } = updateRoom;
    
    await updateRoomAmenitiesToDb(roomId, amenities, roomtype)
    
    const query = `UPDATE Room 
    SET room_number = ?,
        capacity = ?,
        price_per_night = ?,
        start_date = ?,
        end_date = ?
   
    WHERE room_id = ? AND hotel_id = ?`;
    const [rows] = await pool.execute(query, [roomNumber, capacity, pricePerNight, startDate, endDate, roomId, hotelId]);
    return rows;
};


// exports.listRoomToDb = async (pagination) => {
//     const { hotelId, limit, offset } = pagination;
    
//     const query = `SELECT 
//     Room.room_id,
//     Room.price_per_night,
//     Room.room_type,
//     Room.room_number,
//     Room.start_date,
//     Room.end_date,
//     Room.room_id,
//     Room.capacity
// FROM
//     Room
// WHERE 
//     Room.hotel_id = ?
// GROUP BY
//     Room.room_id LIMIT ? OFFSET ?`;
//     const [rows] = await pool.execute(query, [hotelId, limit, offset]);
//     return rows;
// }

// list with amenities of room may be hotel also if not working please check this one - both frontend and backend screen

exports.listRoomToDb = async (pagination) => {
    // const { hotelId, limit, offset } = pagination;
    const { hotelId, limit, offset, orderBy, filters, type } = pagination;
    // console.log(pagination, 'fasdfads');
    if(type === 'website') {
        let colName=null;
        let colValue = null
        if(filters != null && Object.entries(filters).length > 0){
            const filterKey = Object.keys(filters);
            colName = toMatchKeyWithTable(filterKey[0])
            colValue = `"%${filters[filterKey[0]].filter}%"`
            console.log(colName, colValue);
        }else{
            colName = orderBy[0].colId == 'hotelId' ? 'room_id' : orderBy[0].colId;
        }
    
        const sortDirection = (orderBy?.[0]?.sort) ? orderBy[0].sort : 'ASC';
    
        const query = `
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
            Hotel ON Room.hotel_id = Hotel.hotel_id
        WHERE 
            ${colValue} IS NULL OR Room.${colName} LIKE ${colValue}          
        GROUP BY
            Room.room_id 
        LIMIT ? OFFSET ?`;
        
        const [rows] = await pool.execute(query, [limit, offset]);
        return rows;
    } else {
        const query = `
            SELECT 
                Room.room_id,
                Room.price_per_night,
                Room.room_number,
                Room.start_date,
                Room.end_date,
                Room.capacity,
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
            WHERE 
                Room.hotel_id = ?
            GROUP BY
                Room.room_id 
            LIMIT ? OFFSET ?`;
            
            const [rows] = await pool.execute(query, [hotelId, limit, offset]);
            return rows;
    }
    };


    // SELECT 
    //           Hotel.hotel_name
    //         FROM
    //             Hotel
    //         WHERE 
    //             Hotel.hotel_name LIKE '%Holiday%';

// exports.listRoomToDb = async (pagination) => {
//     const { hotelId, limit, offset } = pagination;
    
//     const query = `
//     SELECT 
//         Room.room_id,
//         Room.price_per_night,
//         Room.room_number,
//         Room.start_date,
//         Room.end_date,
//         Room.capacity,
//         GROUP_CONCAT(Amenity.name ORDER BY Amenity.name SEPARATOR ',') AS amenities,
//         GROUP_CONCAT(DISTINCT roomtype.name ORDER BY roomtype.name SEPARATOR ', ') AS roomtype
//     FROM
//         Room
//     LEFT JOIN
//         RoomAmenity ON Room.room_id = RoomAmenity.room_id
//     LEFT JOIN
//         Amenity ON Amenity.amenity_id = RoomAmenity.amenity_id
//     LEFT JOIN 
//         roomcategory ON Room.room_id = roomcategory.room_id
//     LEFT JOIN 
//         roomtype ON roomtype.type_id = roomcategory.type_id
//     WHERE 
//         Room.hotel_id = ?
//     GROUP BY
//         Room.room_id 
//     LIMIT ? OFFSET ?`;
    
//     const [rows] = await pool.execute(query, [hotelId, limit, offset]);
//     return rows;
// };





// exports.listRoomToDb = async (pagination) => {
//     const { limit, offset } = pagination;
    
//     const query = `SELECT 
//     Hotel.hotel_name,
//     Hotel.address,
//     Hotel.city,
//     Hotel.state,
//     Hotel.country,
//     Hotel.hotel_id,
//     Hotel.total_rooms,
//     GROUP_CONCAT(DISTINCT hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype,
//     GROUP_CONCAT(DISTINCT amenity.name ORDER BY amenity.name SEPARATOR ', ') AS amenity
// FROM
//     Hotel
//     LEFT JOIN 
//         hotelamenity ON Hotel.hotel_id = hotelamenity.hotel_id
//     LEFT JOIN 
//         amenity ON amenity.amenity_id = hotelamenity.amenity_id
//     LEFT JOIN 
//         hotelcategory ON Hotel.hotel_id = hotelcategory.hotel_id
//     LEFT JOIN 
//         hoteltype ON hoteltype.type_id = hotelcategory.type_id 
// GROUP BY
//     Hotel.hotel_id LIMIT ? OFFSET ?`;
//     const [rows] = await pool.execute(query, [limit, offset]);
//     return rows;
// };

// exports.listRoomToDb = async (pagination) => {
//     const { limit, offset } = pagination;
    
//     const query = `SELECT 
//     Room.room_id,
//     Room.price_per_night,
//     Room.room_type,
//     Room.room_number,
//     Room.start_date,
//     Room.end_date,
//     Room.room_id,
//     Room.capacity,
//     Room.hotel_id,
//     Hotel.hotel_name,
//     Hotel.address,
//     Hotel.city,
//     Hotel.state,
//     Hotel.country,
//     GROUP_CONCAT(DISTINCT hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype,
//     GROUP_CONCAT(DISTINCT amenity.name ORDER BY amenity.name SEPARATOR ', ') AS amenity,
//     (
//         SELECT COUNT(DISTINCT r.room_id)
//         FROM Room AS r
//         WHERE r.status = 0 AND r.hotel_id = Room.hotel_id
//     ) AS inactiveRoomCount
// FROM
//     Room
// LEFT JOIN 
//         hotelamenity ON Room.hotel_id = hotelamenity.hotel_id
// LEFT JOIN 
//     amenity ON amenity.amenity_id = hotelamenity.amenity_id
// LEFT JOIN 
//     hotelcategory ON Room.hotel_id = hotelcategory.hotel_id
// LEFT JOIN 
//     hoteltype ON hoteltype.type_id = hotelcategory.type_id
// LEFT JOIN 
//     hotel ON hotel.hotel_id = room.hotel_id
    
// GROUP BY
//     Room.hotel_id LIMIT ? OFFSET ?`;
//     const [rows] = await pool.execute(query, [limit, offset]);
//     return rows;
// };


// exports.listRoomByHotelToDb = async (pagination) => {
//     const { hotelId, limit, offset } = pagination;
    
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
//     const [rows] = await pool.execute(query, [hotelId, limit, offset]);
//     return rows;
// };
