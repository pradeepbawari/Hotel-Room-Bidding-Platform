import { configureStore } from '@reduxjs/toolkit';
import { hotelsSlice, roomsByHotelSlice, roomsSlice, signUpSlice, updateHotelId, signInSlice, addUpdateSlice, getHotelBidSlice, getList, fetchHotelImages } from './slices/reducerSlice';

const store = configureStore({
    reducer: {
       [hotelsSlice.name]: hotelsSlice.reducer,
       [roomsSlice.name]: roomsSlice.reducer,
       [roomsByHotelSlice.name] : roomsByHotelSlice.reducer,
       [signUpSlice.name]: signUpSlice.reducer,
       [signInSlice.name]: signInSlice.reducer,
       [addUpdateSlice.name]: addUpdateSlice.reducer,
       [getHotelBidSlice.name] : getHotelBidSlice.reducer,
       [getList.name]: getList.reducer,
       [fetchHotelImages.name]: fetchHotelImages.reducer,
       updateHotelId
    },
})

export default store