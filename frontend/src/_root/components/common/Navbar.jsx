import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import LopInPage from '../../../_auth/LopInPage';
import Modal from '../../../utils/Modal';
import SignUp from '../../../_auth/signUpPage';
import { localStorageGet, localStorageSet } from '../../../utils/common_utils';

const Navbar = () => {

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userData, setUserData] = useState(localStorageGet('userData'))
  const navigate = useNavigate();

  const openSignInModal = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);    
  };

  const openSignUpModal = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  const closeModals = () => {
    setUserData(localStorageGet('userData'));
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

  const logoutHandler = () => {
    localStorageSet('userData', '');
    setUserData(localStorageGet('userData'));
  }

  const handleLink = (e) => {
    localStorage.setItem('url', e)
    navigate(e)
  }

  return (
    <>
      <nav className="space-y-3 md:space-y-0 md:flex md:space-x-20 uppercase py-2 px-4">
        <a onClick={(e)=>handleLink("/deal-in-hotels")} className="block hover:text-blue-600 py-3">Hotel Deals</a>
        <a onClick={(e)=>handleLink("/deal-in-hotel-rooms")} className="block hover:text-blue-600 py-3">Room Deals</a>
        <a href="/" className="block hover:text-blue-600 py-3">Package Deal</a>
        <a href="/" className="block hover:text-blue-600 py-3">Why?</a>
        {userData && (
          <span className='hover:text-red-700 font-bold py-2 rounded capitalize'>{userData?.agentName} <button onClick={logoutHandler} className='bg-gray-100 hover:text-red-700 py-2 px-2 mx-2 font-bold rounded capitalize text-xs'>Logout</button></span>
          )
        }
        {!userData?.agentName && (<button onClick={openSignInModal} className="bg-red-500 hover:bg-res-700 text-white font-bold py-2 px-12 rounded uppercase">Sign IN / Sign UP</button>)}
      </nav>

      {isSignInOpen && (
        <Modal closeModal={closeModals}>
          <LopInPage closeModal={closeModals} switchModal={openSignUpModal} />
        </Modal>
      )}

      {isSignUpOpen && (
        <Modal closeModal={closeModals}>
          <SignUp closeModal={closeModals} switchModal={openSignInModal} />
        </Modal>
      )}

    </>
  );
};

export default Navbar;
