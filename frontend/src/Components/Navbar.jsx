import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchUser from './SearchUser';

const Navbar = ({ currentUser, onUserSelect, setSelectedChat }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/')

    window.location.reload()

  };

  return (
    <header className="bg-blue-500 shadow">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-xl font-semibold text-white">React Time Chat</a>
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          <div className="relative">
            <SearchUser onUserSelect={onUserSelect} currentUser={currentUser} setSelectedChat={setSelectedChat} />
          </div>
          <div className="ml-3 relative">
            <div
              className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white cursor-pointer"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            >
              <img className="h-8 w-8 rounded-full" src={currentUser?.picture} alt="User avatar" />
            </div>
            {showLogoutPopup && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex sm:hidden">
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-500 hover:bg-white focus:outline-none focus:bg-white focus:text-blue-500"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className={`block h-6 w-6 ${showMobileMenu ? 'hidden' : 'block'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`hidden h-6 w-6 ${showMobileMenu ? 'block' : 'hidden'}`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
    {showMobileMenu && (
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <div className="px-2">
            <SearchUser onUserSelect={onUserSelect} currentUser={currentUser} setSelectedChat={setSelectedChat} />
          </div>
          <div className="px-2 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <img className="h-8 w-8 rounded-full" src={currentUser?.picture} alt="User avatar" />
              <button
                className="ml-3 block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </header>
  );
};

export default Navbar;
