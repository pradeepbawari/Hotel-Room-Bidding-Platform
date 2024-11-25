import { configureStore } from '@reduxjs/toolkit';
import { hotelsSlice, roomsByHotelSlice, roomsSlice, signUpSlice, updateHotelId, signInSlice, addUpdateSlice, getHotelBidSlice, getSearchLocation, getSearchHotel, getSearchHotelPage, getSearchHotelRoomPage } from './slices/reducerSlice';

const store = configureStore({
    reducer: {
       [hotelsSlice.name]: hotelsSlice.reducer,
       [roomsSlice.name]: roomsSlice.reducer,
       [roomsByHotelSlice.name] : roomsByHotelSlice.reducer,
       [signUpSlice.name]: signUpSlice.reducer,
       [signInSlice.name]: signInSlice.reducer,
       [addUpdateSlice.name]: addUpdateSlice.reducer,
       [getHotelBidSlice.name] : getHotelBidSlice.reducer,
       [getSearchLocation.name] : getSearchLocation.reducer,
       [getSearchHotel.name] : getSearchHotel.reducer,
       [getSearchHotelPage.name] : getSearchHotelPage.reducer,  
       [getSearchHotelRoomPage.name] : getSearchHotelRoomPage.reducer,
    },
    
})

export default store