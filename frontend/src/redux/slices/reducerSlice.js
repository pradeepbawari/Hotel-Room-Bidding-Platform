import { createSlice } from '@reduxjs/toolkit';
import initialState from '../states';


export const updateHotelId = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_HOTEL_ID':
      localStorage.setItem('hotelId', action.payload);
      return {
        ...state,
        hotelId: action.payload,
      };
    case 'UPDATE_ROOM_ID':
      localStorage.setItem('roomId', action.payload);
      return {
        ...state,
        roomId: action.payload,
      };
    default:
      return state;
  }
};

export const hotelsSlice = createSlice({
    name: 'hotels',
    initialState: {
        hotels: [],
    },
    reducers: {
      cacheHotels: (state, action) => {
        state.hotels = action.payload;
      },
    }
});

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
      rooms: [],
  },
  reducers: {
    cacheRooms: (state, action) => {
      state.rooms = action.payload;
    },
  }
});

export const roomsByHotelSlice = createSlice({
  name: 'roombyhotel',
  initialState: {
    roombyhotel: [],
  },
  reducers: {
    cacheRoomsByHotel: (state, action) => {
      state.roombyhotel = action.payload;
    },
  }
});

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState: {
    signUp: [],
  },
  reducers: {
    cacheSignUp: (state, action) => {
      state.signUp = action.payload;
    },
  }
});

export const signInSlice = createSlice({
  name: 'signIn',
  initialState: {
    signIn: [],
  },
  reducers: {
    cacheSignIn: (state, action) => {
      state.signIn = action.payload;
    },
  }
});

export const addUpdateSlice = createSlice({
  name: 'addUpdateBid',
  initialState: {
    addUpdateBid: [],
  },
  reducers: {
    cacheAddUpdateBid: (state, action) => {
      state.addUpdateBid = action.payload;
    },
  }
});

export const getHotelBidSlice = createSlice({
  name: 'hotelbid',
  initialState: {
    hotelbid: [],
  },
  reducers: {
    cacheByHotel: (state, action) => {
      state.hotelbid = action.payload;
    },
  }
});

export const getSearchLocation = createSlice({
  name: 'searchLoc',
  initialState,
  reducers: {
    cacheSearchLocation: (state, action) => {
      // state.searchLoc = action.payload;
      const key = action.payload;
      if (state[key] !== undefined) {
        state[key] = Array.isArray(state[key]) ? [] : {};
      } else {
        state.searchLoc = action.payload;
      }
    },
  }
});

export const getSearchHotel = createSlice({
  name: 'searchHtl',
  initialState: {
    searchHtl: [],
  },
  reducers: {
    cacheSearchHotel: (state, action) => {
      // state.searchHtl = action.payload;
      const key = action.payload;
      if (state[key] !== undefined) {
        state[key] = Array.isArray(state[key]) ? [] : {};
      } else {
        state.searchHtl = action.payload;
      }
    },
  }
});

export const getSearchHotelPage = createSlice({
  name: 'searchHotelPage',
  initialState: {
    searchHotelPage: [],
  },
  reducers: {
    cacheSearchHotelPage: (state, action) => {
      state.searchHotelPage = action.payload;
    },
  }
});

export const getSearchHotelRoomPage = createSlice({
  name: 'searchHotelRoomPage',
  initialState: {
    searchHotelRoomPage: [],
  },
  reducers: {
    cacheSearchHotelRoomPage: (state, action) => {
      state.searchHotelRoomPage = action.payload;
    },
  }
});
