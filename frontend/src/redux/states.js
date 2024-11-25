import { localStorageGet } from '../utils/common_utils';

const initialState = {
    hotelId: localStorageGet('hotelId') || null,
    roomId: localStorageGet('roomId') || null,
    searchLoc: [],
    searchHtl: [],
    itemDetails: {},
  };
  
  
export default initialState;