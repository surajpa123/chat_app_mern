import React from 'react';
import SearchUser from './SearchUser';

const Navbar = ({ currentUser, onUserSelect, setSelectedChat }) => {
  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="text-xl font-semibold dark:text-white">Brand</a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
             
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative">
              <SearchUser onUserSelect={onUserSelect} currentUser = {currentUser} setSelectedChat = {setSelectedChat} />
            </div>
            <div className="ml-3 relative">
              <div className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white">
                <img className="h-8 w-8 rounded-full" src={currentUser?.picture} alt="User avatar" />
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
              <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className="hidden h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
