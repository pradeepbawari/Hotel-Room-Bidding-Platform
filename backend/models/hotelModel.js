const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file
const { getListHotelToDb, updateAmenitiesToDb, hotelamenityDel, delQueryhotelcategoryDel, addAmenitiesToDb, delQueryhotelImages, totalCountHotels } = require('./utilesModel');

const pool = mysql.createPool(dbConfig);

// only admin 

exports.addHotelToDb = async (newHotel) => {
    // console.log(newHotel, 'hhh');
    const {hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website, pricePerNight, amenity, hoteltype} = newHotel;
    
    const query = 'INSERT INTO Hotel (hotel_name, address, city, state, country, postal_code, phone_number, contact_person, email, website, price_per_night) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website, pricePerNight]);
    rows.insertId != undefined && rows.insertId != null ? [{userId: rows.insertId}] : null;
    await addAmenitiesToDb(rows.insertId, amenity, hoteltype)
    return rows;
};

exports.deleteHotelToDb = async (id) => {
    const hotelId = id.hotelId
    try {
        // Step 1: Delete from tables that reference room_id or other related data
        await pool.execute('DELETE FROM roomamenity WHERE room_id IN (SELECT room_id FROM room WHERE hotel_id = ?)', [hotelId]);
        await pool.execute('DELETE FROM room WHERE hotel_id = ?', [hotelId]);

        // Step 2: Delete from related tables that reference hotel_id
        await pool.execute('DELETE FROM hotelamenity WHERE hotel_id = ?', [hotelId]);
        await pool.execute('DELETE FROM hotelcategory WHERE hotel_id = ?', [hotelId]);
        await pool.execute('DELETE FROM hotelimagesw WHERE hotel_id = ?', [hotelId]);

        // Step 3: Finally, delete from Hotel table
        const query = `DELETE FROM Hotel WHERE hotel_id = ?`;
        const [result] = await pool.execute(query, [parseInt(hotelId)]);

        if (result.affectedRows === 0) {
            throw new Error(`No hotel found with id ${hotelId}`);
        }

        return { message: `Hotel with id ${hotelId} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting hotel with id ${hotelId}`);
        throw error;
    }
};


exports.updateHotelToDb = async (updateHotel) => {
    const {hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website, pricePerNight, hotelId, amenity, hoteltype } = updateHotel;
    
    await updateAmenitiesToDb(hotelId, amenity, hoteltype)
    
    const query = `UPDATE Hotel 
    SET hotel_name = ?,
        address = ?,
        city = ?,
        state = ?,
        country = ?,
        postal_code = ?,
        phone_number = ?,
        contact_person = ?,
        email = ?, 
        website = ?,
        price_per_night = ?

    WHERE hotel_id = ?`;
    
    const [rows] = await pool.execute(query, [hotelName, address, city, state, country, postalCode, phoneNumber, contactPerson, email, website, pricePerNight, hotelId]);
    return rows;
};

exports.listHotelToDb = async (pagination) => {
    // console.log(pagination);
    const rows = await getListHotelToDb(pagination);
    const rowsCount = await totalCountHotels()
    const total = rowsCount[0].total_rows
    return {rows, total};
}

exports.getHotelImagesServiceToDb = async (id) => {
    const { hotelId } = pagination;
    const query = `SELECT 
    Hotel.hotel_id,
    Hotel.image_id,
    Hotel.big_img,
    Hotel.medium_img,
    Hotel.small_img
FROM
    Hotel
WHERE Hotel.hotel_id = ?`;
        const [rows] = await pool.execute(query, [hotelId]);
        return rows;
};


// use for admin service 

// const query = `SELECT 
//         Hotel.hotel_id,
//         Hotel.hotel_name,
//         Hotel.address,
//         Hotel.city,
//         Hotel.state,
//         Hotel.country,
//         Hotel.postal_code,
//         Hotel.phone_number,
//         Hotel.contact_person,
//         Hotel.email,
//         Hotel.website,
//     GROUP_CONCAT(hoteltype.name ORDER BY hoteltype.name SEPARATOR ', ') AS hoteltype
//     FROM
//         Hotel
//     LEFT JOIN
//         hotelcategory ON Hotel.hotel_id = hotelcategory.hotel_id
//     LEFT JOIN
//         hoteltype ON hoteltype.type_id = hotelcategory.type_id
//     GROUP BY
//         Hotel.hotel_id LIMIT ? OFFSET ?`;