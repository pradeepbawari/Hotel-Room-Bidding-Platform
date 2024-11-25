const express = require('express');
const { addRoom, deleteRoom, updateRoom, listRoom } = require('../controllers/roomController');
const router = express.Router();

router.post('/add', addRoom);
router.post('/delete', deleteRoom);
router.post('/update', updateRoom);
router.post('/list', listRoom);

module.exports = router;
