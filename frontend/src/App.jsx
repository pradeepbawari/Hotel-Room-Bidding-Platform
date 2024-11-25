import { useRoutes } from 'react-router-dom';

import RootLayout from './_root/RootLayout'
import Hotels from './_root/pages/Hotels'
import NotFound from './_root/pages/NotFound';
import Home from './_root/pages/Home';
import Rooms from './_root/pages/Rooms';
import BidsRoom from './_root/pages/BidsRoom';
import BidsHotel from './_root/pages/BidsHotel';
import SearchPageHotel from './_root/search/SearchPageHotel';
import SearchPageRooms from './_root/search/SearchPageRooms';

function App() {
  
  const AppRoutes = () => {
    let routes = useRoutes([
      {
        path: '/', element: <RootLayout />,
        children: [
          { path: '/', element: <Home /> },
          {path: '/deal-in-hotels', element: <Hotels />},
          {path: '/deal-in-hotel-rooms', element: <Rooms />},
          {path: '/bids-in-hotel-and-rooms/:hotelname', element: <BidsRoom />},
          {path: '/bids-in-hotel/:hotelname', element: <BidsHotel />},
          {path: '/search-hotel', element: <SearchPageHotel />},
          {path: '/search-room', element: <SearchPageRooms />}
        ]
      },
      { path: '*', element: <NotFound /> }
    ]);
    return routes;
  };

  return (
    <main>
      <AppRoutes />
    </main>
  )
}

export default App
