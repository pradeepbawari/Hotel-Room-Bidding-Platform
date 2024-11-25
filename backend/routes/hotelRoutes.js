const express = require('express');
const { addHotel, deleteHotel, updateHotel, listHotel, getHotelImages } = require('../controllers/hotelController');
const router = express.Router();

router.post('/add', addHotel);
router.post('/getImages', getHotelImages);
router.post('/delete', deleteHotel);
router.post('/update', updateHotel);
router.post('/list', listHotel);

module.exports = router;
