import React, { useState, useEffect, useRef } from 'react';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, handleLogout }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getPossessiveName = (name) => {
    if (!name) return '';
    return name.endsWith('s') ? `${name}'` : `${name}'s`;
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="header absolute w-full shadow-lg bg-white flex px-4 md:px-12 py-2 md:py-4 justify-between">
      <h1 className="text-3xl font-black" onClick={() => navigate('/')}>Graph Anything</h1>
      <div className="relative flex gap-2 items-center">
        {user ? (
          <>
            <Avatar name={user.displayName} size="40" round={true} onClick={toggleDropdown} className="cursor-pointer hover:shadow-lg hover:border" />
            {dropdownVisible && (
              <div ref={dropdownRef} className="absolute right-0 top-0 translate-y-1/4 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-gray-700 font-semibold border-b border-gray-200 hover:cursor-pointer hover:bg-brand-primary hover:text-white hover:rounded-t-lg" onClick={() =>navigate('/graphlist')}>
                  {getPossessiveName(user.displayName)} Account
                </div>
                <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:text-black" onClick={() =>navigate('/graphlist')}>My Graphs</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:text-black" onClick={() =>navigate('/')}>User Settings</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:text-black" onClick={() =>navigate('/')}>Billing</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:text-black" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </>
        ) : (
            <div className="flex gap-2">
                <button className="bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-brand-primary-dark" onClick={() => navigate('/signup?isSignUp=false')}>Sign In</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Header;