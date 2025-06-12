import React, { useState } from 'react';
import eLogo from '../assets/lakerslogo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import { User, Menu, X } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const activeLinkStyle =
    'bg-[#552583] text-[#FDB927] rounded-full px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 font-bold shadow-lg transition-all duration-300 transform hover:scale-105';

  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#552583] to-[#3a1c6b] border-b-2 sm:border-b-4 border-[#FDB927] shadow-lg sm:shadow-2xl">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-4 group">
          <img 
            src={eLogo} 
            alt="logo" 
            className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:rotate-12" 
          />
          <h1 className="text-[#FDB927] font-extrabold text-xl sm:text-2xl md:text-3xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#FDB927] to-[#f8d56a]">
            King Lebron
          </h1>
        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          className="sm:hidden text-[#FDB927] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-1 sm:space-x-3 md:space-x-6">
          <ul className="flex space-x-1 sm:space-x-3 md:space-x-6 text-[#FDB927] font-bold text-sm sm:text-base md:text-lg">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? activeLinkStyle
                    : 'hover:bg-[#FDB927]/20 hover:text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-8 md:py-3 transition-all duration-300 hover:shadow-md sm:hover:shadow-lg'
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? activeLinkStyle
                    : 'hover:bg-[#FDB927]/20 hover:text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-8 md:py-3 transition-all duration-300 hover:shadow-md sm:hover:shadow-lg'
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  isActive
                    ? activeLinkStyle
                    : 'hover:bg-[#FDB927]/20 hover:text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-8 md:py-3 transition-all duration-300 hover:shadow-md sm:hover:shadow-lg'
                }
              >
                ARTICLES
              </NavLink>
            </li>
          </ul>

          {/* Login Button (Desktop) */}
          <Button
            className="bg-[#FDB927] hover:bg-[#ffd343] text-[#552583] font-bold px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md sm:rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl hover:scale-105 group"
            onClick={handleLoginClick}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
            <span className="hidden sm:inline"></span>
          </Button>
        </div>

        {/* Mobile Menu (shown when hamburger is clicked) */}
{isOpen && (
  <div className="sm:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#552583] to-[#3a1c6b] border-t border-[#FDB927] shadow-lg py-4 px-6">
    <div className="flex flex-col items-center space-y-4"> {/* Centered container */}
      <h2 className="text-[#FDB927] font-extrabold text-2xl mb-2 w-full text-center"> {/* Title */}
        King Lebron
      </h2>
      
      <ul className="w-full space-y-4 text-[#FDB927] font-bold text-lg"> {/* Full width list */}
        <li className="w-full text-center"> {/* Centered list items */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block w-full py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
                isActive 
                  ? 'bg-[#552583] text-[#FDB927] shadow-lg transform hover:scale-105'
                  : 'hover:bg-[#FDB927]/20 hover:text-white'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            HOME
          </NavLink>
        </li>
        <li className="w-full text-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block w-full py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
                isActive 
                  ? 'bg-[#552583] text-[#FDB927] shadow-lg transform hover:scale-105'
                  : 'hover:bg-[#FDB927]/20 hover:text-white'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            ABOUT
          </NavLink>
        </li>
        <li className="w-full text-center">
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `block w-full py-3 rounded-full transition-all duration-300 hover:shadow-lg ${
                isActive 
                  ? 'bg-[#552583] text-[#FDB927] shadow-lg transform hover:scale-105'
                  : 'hover:bg-[#FDB927]/20 hover:text-white'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            ARTICLES
          </NavLink>
        </li>
      </ul>

      <Button
        className="w-full max-w-xs bg-[#FDB927] hover:bg-[#ffd343] text-[#552583] font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group"
        onClick={() => {
          handleLoginClick();
          setIsOpen(false);
        }}
      >
        <User className="w-5 h-5 group-hover:animate-pulse" />
        <span>Login</span>
      </Button>
    </div>
  </div>
)}
      </div>
    </nav>
  );
}

export default Navbar;