import React from 'react';

const Navbar = () => {
  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {/* Brand / Logo */}
            <a href="/" className="text-2xl font-semibold text-white">
              <span className="text-white">Nelly</span>
              <span className="text-gray-300">Hernández</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 text-white items-center">
            <a href="#" className="text-gray-300 hover:text-white">
             Projects
            </a>
           
            <a href="#" className="text-gray-300 hover:text-white">
              About me
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Blog
            </a>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;