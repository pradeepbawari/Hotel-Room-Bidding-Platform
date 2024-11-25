const express = require('express');
const { searchControl, searchLocControl, searchHotelControl, searchHotelPageControl, searchHotelRoomPageControl } = require('../controllers/searchController');
const router = express.Router();

router.get('/string', searchControl);
router.post('/location', searchLocControl);
router.post('/hotel', searchHotelControl);
router.post('/searchhotel', searchHotelPageControl);
router.post('/searchhotelroom', searchHotelRoomPageControl);
module.exports = router;
