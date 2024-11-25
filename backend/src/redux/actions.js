import { createAction } from "@reduxjs/toolkit";
import { baseUrl } from "../envirnment";
import axiosInstance from "../interceptor";
import { convertDateFormat, localStorageSet } from "../utils/common_utils";

const cacheHotels = createAction('hotels/cacheHotels')
const cacheRooms = createAction('rooms/cacheRooms')
const cacheRoomsByHotel = createAction('roombyhotel/cacheRoomsByHotel')
const cacheSignUp = createAction('signUp/cacheSignUp')
const cacheSignIn = createAction('signIn/cacheSignIn')
const cacheAddUpdateBid = createAction('addUpdateBid/cacheAddUpdateBid')
const cacheByHotel = createAction('hotelbid/cacheByHotel')
const cacheAddUpdateHotels = createAction('addUpdateHotel/cacheAddUpdateHotels')
const cacheFetchHotelImages = createAction('fetchImages/cacheFetchHotelImages')
const cacheByGetList = createAction('getList/cacheByGetList')

const baseURL = baseUrl;

export const updateHotelId = (id, type) => ({
    type: type,
    payload: id,
 });

// hotel action only

export const fetchHotels = (pageConfig) => async (dispatch) => {
    try {
      await axiosInstance.post(`${baseURL}hotels/list`, pageConfig).then(res=>{
        const data = res?.data;
        dispatch(cacheHotels(data));
      }) 
    } catch (error) {
      console.log('Error fetching hotels:', error);
    }
};

export const addHotels = (pageConfig, mode) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}hotels/${mode}`, pageConfig).then(res=>{
      const data = res?.data?.results;
      dispatch(cacheAddUpdateHotels(data));
    }) 
  } catch (error) {
    console.log('Error fetching hotels:', error);
  }
};

export const fetchHotelImage = (imageData, mode) => async (dispatch) => {
  try {
    if(mode == 'add') {
      await axiosInstance.post(`${baseURL}uploadImages/${mode}`, imageData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }}).then(res=>{
        const data = res?.data?.results;
        dispatch(cacheFetchHotelImages(data));
      })
    } else {
      await axiosInstance.post(`${baseURL}uploadImages/${mode}`, imageData).then(res=>{
        const data = res?.data?.results;
        dispatch(cacheFetchHotelImages(data));
      })
    }
     
  } catch (error) {
    console.log('Error fetching hotels:', error);
  }
};


export const fetchRooms = (pageConfig) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}rooms/list`, pageConfig).then(res=>{
      let data = res?.data?.results;
      
      data = data.map(room=>{
          room.endDate = convertDateFormat(room.endDate)
          room.startDate = convertDateFormat(room.startDate)
          return room;
        }
      )
      
      dispatch(cacheRooms(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const fetchRoomsByHotel = (pageConfig) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}bids/bidbyroom`, pageConfig).then(res=>{
      let data = res?.data?.results;
      
      data.hotelData.status = data.hotelData.status = data.hotelData.status == 1 ? 'Closed' : 'Open'
      data.hotelData.amenity = data.hotelData.amenity ? data.hotelData.amenity.split(",") : []
      data.roomData = data.roomData.map(room=>{
          if(room.endDate) room.endDate = convertDateFormat(room.endDate)
          if(room.startDate) room.startDate = convertDateFormat(room.startDate)
          return room;
        }
      )
      
      dispatch(cacheRoomsByHotel(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const addRooms = (pageConfig, mode) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}rooms/${mode}`, pageConfig).then(res=>{
      const data = res?.data?.results;
      dispatch(cacheAddUpdateHotels(data));
    }) 
  } catch (error) {
    console.log('Error fetching hotels:', error);
  }
};

export const signUp = (userData) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}auth/signup`, userData).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheSignUp(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const signIn = (userData) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}auth/signin`, userData).then(res=>{
      let data = res?.data?.results;
      localStorageSet('userData', data[0]?.data[0])
      dispatch(cacheSignIn(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const addUpdateBid = (bidInput, update) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}bids/${update}`, bidInput).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheAddUpdateBid(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const fetchBidByHotel = (pageConfig) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}bids/bidbyhotel`, pageConfig).then(res=>{
      let data = res?.data?.results;
      data.hotelData.status = data.hotelData.status = data.hotelData.status == 1 ? 'Closed' : 'Open'
      data.hotelData.amenity = data.hotelData.amenity ? data.hotelData.amenity.split(",") : []
      // data.roomData = data.roomData.map(room=>{
      //     if(room.endDate) room.endDate = convertDateFormat(room.endDate)
      //     if(room.startDate) room.startDate = convertDateFormat(room.startDate)
      //     return room;
      //   }
      // )
      
      dispatch(cacheByHotel(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

// get all list service

export const getListData = () => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}getList/hotelAmenityList`).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheByGetList(data))
    })
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
}

