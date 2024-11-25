import React, { useEffect } from 'react';
import Navbar from '../components/common/Navbar';

const Header = () => {
  useEffect(() => {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    const toggleMenu = () => {
      menu.classList.toggle('hidden');
    };

    menuBtn.addEventListener('click', toggleMenu);

    return () => {
      menuBtn.removeEventListener('click', toggleMenu);
    };
  }, []);

  return (
        <header className="bg-white shadow-md bg-header">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              <a href="/" className="text-2xl font-bold space-y-4">BidHotel</a>
              <div className="hidden md:flex">
                  <Navbar />
              </div>
              <div className="md:hidden">
                  <button id="menu-btn" className="text-blue-600 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                  </button>
              </div>
          </div>
          <div id="menu" className="md:hidden hidden md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <Navbar />
          </div>
        </header>
  );
};

export default Header;
