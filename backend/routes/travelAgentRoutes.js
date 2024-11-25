const express = require('express');
const { addTravelAgent, deleteTravelAgent, updateTravelAgent, listTravelAgent } = require('../controllers/travelAgentController');
const router = express.Router();

router.post('/add', addTravelAgent);
router.post('/delete', deleteTravelAgent);
router.post('/update', updateTravelAgent);
router.post('/list', listTravelAgent);

module.exports = router;
