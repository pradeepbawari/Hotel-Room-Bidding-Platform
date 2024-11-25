const express = require('express');
const bodyParser = require('body-parser');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bidRoutes = require('./routes/bidRoutes');
const travelRoutes = require('./routes/travelAgentRoutes');
const getList = require('./routes/getList');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRouter = require('./routes/uploadHotelImagesRouter');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
// app.use(cors({origin:'*', allowedHeaders:'Access-Control-Allow-Origin'}));
// app.use(cors({
//     origin: 'http://localhost:5173', // Replace with your React app's origin
//     credentials: true
//   }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/travelAgent', travelRoutes);
app.use('/api/getList', getList);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploadImages', uploadRouter);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
