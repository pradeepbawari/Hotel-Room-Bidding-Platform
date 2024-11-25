import { createSlice } from '@reduxjs/toolkit';
import { localStorageGet } from '../../utils/common_utils';


const initialState = {
  hotelId: localStorageGet('hotelId') || null,
  roomId: localStorageGet('roomId') || null,
};

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

export const addUpdateHotel = createSlice({
  name: 'addUpdateHotel',
  initialState: {
    addUpdateHotel: [],
  },
  reducers: {
    cacheAddUpdateHotels: (state, action) => {
      state.addUpdateHotel = action.payload;
    },
  }
});

// get all list service

export const getList = createSlice({
  name: 'getList',
  initialState: {
    getList: [],
  },
  reducers: {
    cacheByGetList: (state, action) => {
      state.getList = action.payload;
    },
  }
});

export const fetchHotelImages = createSlice({
  name: 'fetchImages',
  initialState: {
    fetchImages: [],
  },
  reducers: {
    cacheFetchHotelImages: (state, action) => {
      state.fetchImages = action.payload;
    },
  }
});
