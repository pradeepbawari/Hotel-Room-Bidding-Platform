const { transformKeysToCamelCase } = require('../core/utiles');
const { addHotelService, deleteHotelService, updateHotelService, listHotelService, getHotelImagesService } = require('../services/hotelService');
const fs = require('fs');
const path = require('path');

const createDirectory = (hotelName) => {
    // Define the directory name
    console.log(hotelName);
const checkName = hotelName.replaceAll(' ', '-');
const dir = path.join(__dirname, '../../frontend/src/assets', 'uploads', checkName);
['small', 'medium', 'feature'].forEach(size => {
    const sizePath = path.join(dir, size);
    if (!fs.existsSync(sizePath)) {
        fs.mkdirSync(sizePath, { recursive: true });
    }
});

fs.mkdir(dir, { recursive: true }, (err) => {
  if (err) {
    return console.error(`Error creating directory: ${err.message}`);
  }
  console.log('Directory "hotel" created successfully!');
});
}

const addHotel = async (req, res) => {
    
    try {
        const newHotel = req.body;
        await createDirectory(newHotel.hotelName)
        const result = await addHotelService(newHotel);        
        return res.status(200).send({ results: 'Hotel successfully added', status: 200 });
    } catch (err) {
        console.error('Error fetching add travel Hotel details:', err);
        return res.status(500).send('Server connection error');
    }
};

const deleteHotel = async (req, res) => {

    try {
        const hotelId = req.body;
        const result = await deleteHotelService(hotelId);
        return res.status(200).send({results: 'Hotel successfully deleted', status: 200})     
    } catch(err) {
        console.error('Error delete hotel by id controller page:', err);
        return res.status(500).send('Server connection error');
    }
}

const updateHotel = async (req, res) => {

    try {
        const updateHotel = req.body;
        const result = await updateHotelService(updateHotel);
        return res.status(200).send({results: 'Hotel successfully update', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Hotel details:', err);
        return res.status(500).send('Server connection error');
    }
}

const listHotel = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await listHotelService(pagination);
        
        const modifyData = result.rows.map(item => {
            if (item.amenity != null && item.amenity !== '') {
              return {
                ...item,
                amenity: item.amenity.split(',')
              };
            }
            return item;
        });
        const data = modifyData.map(item=>transformKeysToCamelCase(item))
        return res.status(200).send({results: data, total: result.total, status: 200})     
    } catch(err) {
        console.error('Error fetching hotel in hotelController page:', err);
        return res.status(500).send('Server connection error');
    }
}

// get hotel images based on hotel id

const getHotelImages = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await getHotelImagesService(pagination);
        const data = result.map(item=>transformKeysToCamelCase(item))
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Hotel details:', err);
        return res.status(500).send('Server connection error');
    }
}

const uploadHotelImages = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await getHotelImagesService(pagination);
        const data = result.map(item=>transformKeysToCamelCase(item))
        return res.status(200).send({results: data, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel Hotel details:', err);
        return res.status(500).send('Server connection error');
    }
}


module.exports = { addHotel, deleteHotel, updateHotel, listHotel, getHotelImages, uploadHotelImages }