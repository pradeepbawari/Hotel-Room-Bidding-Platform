const express = require('express');
const { getHotelAmenityList } = require('../controllers/getListController');
const router = express.Router();

router.post('/hotelAmenityList', getHotelAmenityList);
// router.post('/delete', deleteTravelAgent);
// router.post('/update', updateTravelAgent);
// router.post('/list', listTravelAgent);

module.exports = router;
