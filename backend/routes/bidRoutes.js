const express = require('express');
const { addRoomBid, deleteRoomBid, updateRoomBid, listRoomBid, bidByrooms, bidByHotel, addbidbyhotel, updateBidbyhotel } = require('../controllers/bidController');
const router = express.Router();

router.post('/add', addRoomBid);
router.post('/delete', deleteRoomBid);
router.post('/update', updateRoomBid);
router.post('/list', listRoomBid);
router.post('/bidbyroom', bidByrooms);
router.post('/bidbyhotel', bidByHotel);
router.post('/addbidbyhotel', addbidbyhotel);
router.post('/updatebidbyhotel', updateBidbyhotel);

module.exports = router;