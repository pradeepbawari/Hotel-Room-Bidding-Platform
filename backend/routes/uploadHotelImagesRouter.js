const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addHotelImages, deleteHotelImages, updateHotelImages, listHotelImages } = require('../controllers/uploadHotelImagesController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../frontend/src/assets', 'uploads/unused');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/add', upload.array('images', 6), addHotelImages);
router.post('/delete', deleteHotelImages);
router.post('/update', updateHotelImages);
router.post('/list', listHotelImages);

module.exports = router;
