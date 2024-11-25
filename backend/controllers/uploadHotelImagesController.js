const { transformKeysToCamelCase } = require("../core/utiles");
const { uploadHotelImagesService, uploadHotelImagesListService, deleteHotelImagesService } = require("../services/uploadHotelImagesService");

const addHotelImages = async (req, res) => {
    
    try {
        const promises = req.files.map((file) => uploadHotelImagesService(file.path, req.body));
        await Promise.all(promises);

        res.status(200).json({ message: 'Images uploaded and processed successfully' });
    } catch (error) {
        console.error('Error processing images:', error);
        if (error.message.includes('Hotel with ID')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error processing images' });
        }
    }
};

const deleteHotelImages = async (req, res) => {
    try {
        const {id} = req.body;
        const result = await deleteHotelImagesService(id);
        res.status(200).json({ message: 'Images delete and processed successfully' });
    } catch (err) {
        console.log(err);
    }
}

const updateHotelImages = async (req, res) => {
    try {

    } catch (err) {
        console.log(err);
    }
}

const listHotelImages = async (req, res) => {
    
    try {
        const {hotelId} = req.body;
        const result = await uploadHotelImagesListService(hotelId);
        const data = result.map(item => transformKeysToCamelCase(item));
        return res.status(200).send({results: data, status: 200})     

    } catch (err) {
        console.log(err);
    }
}

module.exports = { addHotelImages, deleteHotelImages, updateHotelImages, listHotelImages }