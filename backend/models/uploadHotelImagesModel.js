const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file

const pool = mysql.createPool(dbConfig);
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to crop images to different sizes
const cropImage = async (filePath, size, suffix, hotelName) => {
    const hotelNameChange = hotelName.replaceAll(' ', '-');
    
    // const outputFilePath = filePath.replace(/(\.[\w\d_-]+)$/i, `${suffix}$1`);

    let modifyFilePath = filePath.replace(/unused/g, '').replace(/\/+$/, '').replace(/^\/+/, '');
    // console.log(modifyFilePath);
    const uploadsIndex = modifyFilePath.indexOf('uploads');
    const insertPosition = uploadsIndex + 'uploads'.length;
    const newFilePath = modifyFilePath.slice(0, insertPosition) + `\\${hotelNameChange}` + modifyFilePath.slice(insertPosition);
    
    const sizeDir = path.join(path.dirname(newFilePath), suffix.replace('_', ''));
    
    if (!fs.existsSync(sizeDir)) {
        fs.mkdirSync(sizeDir, { recursive: true });
    }
    console.log(newFilePath, 'gg');
    const finalPath = path.join(sizeDir, path.basename(newFilePath));
    let index = finalPath.indexOf('src');
    let result = finalPath.substring(index);
    console.log(result, 'kk');
    
    await sharp(filePath)
        .resize(size.width, size.height)
        .toFile(finalPath);

    return result;
};

const checkHotelExists = async (hotelId) => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE hotel_id = ?', [hotelId]);
    return rows.length > 0;
};

const checkRoomExists = async (roomId) => {
    const [rows] = await pool.execute('SELECT * FROM room WHERE room_id = ?', [roomId]);
    return rows.length > 0;
};

exports.addHotelImagesDb = async (filePath, data) => {
    const {hotelId, hotelName, userInPage, roomId, roomType} = data;
    
    if(userInPage == 'hotel') {
        const hotelExists = await checkHotelExists(hotelId);
        if (!hotelExists) {
            throw new Error(`Hotel with ID ${hotelId} does not exist`);
        }
    
        try {
            // Crop images to different sizes
            const croppedFeature = await cropImage(filePath, { width: 200, height: 200 }, '_feature', hotelName);
            const croppedSmall = await cropImage(filePath, { width: 200, height: 200 }, '_small', hotelName);
            const croppedMedium = await cropImage(filePath, { width: 500, height: 500 }, '_medium', hotelName);
    
            // Save original and cropped images metadata to the database
            const query = 'INSERT INTO hotelimagesw (hotel_id, image_path, image_size) VALUES (?, ?, ?)';
            await pool.execute(query, [parseInt(hotelId), croppedFeature, 'feature']);
            await pool.execute(query, [parseInt(hotelId), croppedSmall, 'small']);
            const [rows] = await pool.execute(query, [parseInt(hotelId), croppedMedium, 'medium']);
            return rows;
        } catch (error) {
            console.error('Error processing images:', error);
            throw error;
        }    
    } else {
        const hotelExists = await checkRoomExists(roomId);
        if (!hotelExists) {
            throw new Error(`Hotel with ID ${roomId} does not exist`);
        }
        try {
            // Crop images to different sizes
            const fileName = roomType.toLowerCase()
            const croppedFeature = await cropImage(filePath, { width: 200, height: 200 }, fileName, hotelName);
            
            // Save original and cropped images metadata to the database
            const query = 'INSERT INTO roomimages (room_id, image_path, image_size) VALUES (?, ?, ?)';
            const [rows] = await pool.execute(query, [parseInt(roomId), croppedFeature, fileName]);
            return rows;
        } catch (error) {
            console.error('Error processing images:', error);
            throw error;
        }    
    }

};

exports.listHotelImagesDb = async (hotelId) => {
    try {
        const query = 'SELECT id, image_size, image_path FROM hotelimagesw WHERE hotel_id = ?'
        const [rows] = await pool.execute(query, [parseInt(hotelId)])
        return rows
    } catch(err) {
        console.log('list not executed');
        throw err
    }
}

exports.deleteHotelImagesDb = async (id) => {
    try {
        const query = 'DELETE FROM hotelimagesw WHERE id = ?'
        const [rows] = await pool.execute(query, [parseInt(id)])
        return rows
    } catch(err) {
        console.log('list not executed');
        throw err
    }
}