import { createAction } from "@reduxjs/toolkit";
import { baseUrl } from "../envirnment";
import axiosInstance from "../interceptor";
import { convertDateFormat, localStorageSet } from "../utils/common_utils";
import initialState from "./states";

const cacheHotels = createAction('hotels/cacheHotels')
const cacheRooms = createAction('rooms/cacheRooms')
const cacheRoomsByHotel = createAction('roombyhotel/cacheRoomsByHotel')
const cacheSignUp = createAction('signUp/cacheSignUp')
const cacheSignIn = createAction('signIn/cacheSignIn')
const cacheAddUpdateBid = createAction('addUpdateBid/cacheAddUpdateBid')
const cacheByHotel = createAction('hotelbid/cacheByHotel')
const cacheSearchLocation = createAction('searchLoc/cacheSearchLocation')
const cacheSearchHotel = createAction('searchHtl/cacheSearchHotel')
const cacheSearchHotelPage = createAction('searchHotelPage/cacheSearchHotelPage')
const cacheSearchHotelRoomPage = createAction('searchHotelRoomPage/cacheSearchHotelRoomPage')
const updateStateToEmpty = createAction('common/updateStateToEmpty')

const baseURL = baseUrl;

export const updateHotelId = (id, type) => ({
    type: type,
    payload: id,
 });

export const fetchHotels = (pageConfig) => async (dispatch) => {
    try {
      await axiosInstance.post(`${baseURL}hotels/list`, pageConfig).then(res=>{
        const data = res?.data?.results;
        dispatch(cacheHotels(data));
      }) 
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
      console.log(data);
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

export const searchLocation = (input) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}search/location`, input).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheSearchLocation(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const searchHotel = (input) => async (dispatch) => {
  try {
    await axiosInstance.post(`${baseURL}search/hotel`, input).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheSearchHotel(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const searchHotelPage = (input) => async (dispatch) => {
  // console.log(`${baseURL}search/hotelroom?`, {...input}, 'check');
  
  try {
    await axiosInstance.post(`${baseURL}search/searchhotel${input}`).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheSearchHotelPage(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};

export const searchRoomPage = (input) => async (dispatch) => {
  // console.log(`${baseURL}search/hotelroom?`, {...input}, 'check');
  
  try {
    await axiosInstance.post(`${baseURL}search/searchhotelRoom${input}`).then(res=>{
      let data = res?.data?.results;
      dispatch(cacheSearchHotelRoomPage(data));
    }) 
  } catch (error) {
    console.log('Error fetching rooms:', error);
  }
};


export const resetStateToEmpty = (key) => (dispatch) => {
    if(key == 'searchLoc') dispatch(cacheSearchLocation(key));
    if(key == 'searchHtl') dispatch(cacheSearchHotel(key));
};