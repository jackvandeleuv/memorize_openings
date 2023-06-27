import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative bg-white">
      <div className="bg-blue-500 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to='/' className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <img
                className="h-14 w-auto sm:h-12"
                src="/blue-queen.png"
                alt="logo"
              />
              <span className="ml-3 text-xl text-white font-bold">Fried Liver</span>
            </Link>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <button type="button" onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <nav className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link to='/learn' className="mx-5 cursor-pointer text-white hover:underline">Learn</Link>
            <Link to='/about' className="mx-5 cursor-pointer text-white hover:underline">About</Link>
            <Link to='/signin' className="mx-5 cursor-pointer text-white hover:underline">Sign In</Link>
            <Link to='/signup' className="mx-5 cursor-pointer text-white hover:underline">Sign Up</Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="bg-blue-500 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="/blue-queen.png"
                    alt="logo"
                  />
                </div>
                <div className="-mr-2">
                  <button type="button" onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link to='/learn' className="text-gray-900 hover:underline">Learn</Link>
                  <Link to='/about' className="text-gray-900 hover:underline">About</Link>
                  <Link to='/signin' className="text-gray-900 hover:underline">Sign In</Link>
                  <Link to='/signup' className="text-gray-900 hover:underline">Sign Up</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuBar;
