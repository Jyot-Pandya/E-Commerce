import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilCallback, useResetRecoilState, useRecoilValueLoadable } from 'recoil';
import { userInfoState } from '../state/userState';
import { cartState } from '../state/cartState';
import { categoriesQuery } from '../state/productState';
import { FaShoppingCart, FaUser, FaSearch, FaCog, FaClipboardList, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const userInfo = useRecoilValue(userInfoState);
  const cartItems = useRecoilValue(cartState);
  const categoriesLoadable = useRecoilValueLoadable(categoriesQuery);
  const { state: categoriesState, contents: categories } = categoriesLoadable;

  const resetUserInfo = useResetRecoilState(userInfoState);
  const resetCart = useResetRecoilState(cartState);
  
  const logoutHandler = useRecoilCallback(({ reset }) => () => {
    reset(userInfoState);
    reset(cartState);
    navigate('/login');
  });

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    // Close other dropdowns
    setAdminDropdownOpen(false);
    setCategoriesOpen(false);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdownOpen(!adminDropdownOpen);
    // Close other dropdowns
    setProfileDropdownOpen(false);
    setCategoriesOpen(false);
  };

  const toggleCategoriesDropdown = () => {
    setCategoriesOpen(!categoriesOpen);
    // Close other dropdowns
    setProfileDropdownOpen(false);
    setAdminDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword}`);
      setMobileMenuOpen(false);
    } else {
      navigate('/');
    }
  };

  // Handle clicks outside the dropdowns
  const handleClickOutside = (e) => {
    if (!e.target.closest('.dropdown-container') && !e.target.closest('.mobile-menu-button')) {
      setProfileDropdownOpen(false);
      setAdminDropdownOpen(false);
      setCategoriesOpen(false);
    }
  };

  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      {/* Top bar with logo and search */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              ShopHub
            </span>
          </Link>
          
          {/* Search bar - hidden on mobile */}
          <form onSubmit={submitHandler} className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                name="q"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search Products..."
                className="w-full p-2 pl-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaSearch className="text-white" />
              </button>
            </div>
          </form>
          
          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button 
              className="mobile-menu-button p-2 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Categories dropdown */}
            <div className="relative dropdown-container">
              <button 
                className="px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center"
                onClick={toggleCategoriesDropdown}
              >
                Categories <i className="fas fa-caret-down ml-1"></i>
              </button>
              {categoriesOpen && categoriesState === 'hasValue' && categories.length > 0 && (
                <div className="absolute left-0 w-56 bg-white rounded shadow-lg py-2 mt-1 z-10">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center">
              <FaShoppingCart className="mr-1" /> 
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            {userInfo ? (
              <div className="relative dropdown-container">
                <button 
                  className="px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center"
                  onClick={toggleProfileDropdown}
                >
                  <FaUserCircle className="mr-2" />
                  {userInfo.name} <i className="fas fa-caret-down ml-1"></i>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-white rounded shadow-lg py-2 mt-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaUser className="mr-2 text-gray-600" /> Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2 text-gray-600" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center">
                <FaUser className="mr-1" /> Sign In
              </Link>
            )}
            
            {/* Admin menu */}
            {userInfo && userInfo.isAdmin && (
              <div className="relative dropdown-container">
                <button 
                  className="px-3 py-2 rounded hover:bg-gray-700 transition-colors flex items-center"
                  onClick={toggleAdminDropdown}
                >
                  <FaCog className="mr-1" /> Admin <i className="fas fa-caret-down ml-1"></i>
                </button>
                {adminDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-white rounded shadow-lg py-2 mt-1 z-10">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaCog className="mr-2 text-gray-600" /> Dashboard
                    </Link>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaUser className="mr-2 text-gray-600" /> Users
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaShoppingCart className="mr-2 text-gray-600" /> Products
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center"
                    >
                      <FaClipboardList className="mr-2 text-gray-600" /> Orders
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-gray-800 pb-4`}>
        {/* Mobile search */}
        <form onSubmit={submitHandler} className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              name="q"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search Products..."
              className="w-full p-2 pl-10 rounded-full text-gray-800 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </form>
        
        {/* Mobile Categories */}
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="font-semibold mb-2">Categories</div>
          <div className="ml-4 space-y-2">
            {categoriesState === 'hasValue' && categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category}`}
                  className="block py-1 hover:text-blue-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))
            ) : (
              <div className="text-gray-400">Loading categories...</div>
            )}
          </div>
        </div>
        
        {/* Mobile navigation links */}
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/cart" 
            className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaShoppingCart className="inline mr-2" /> Cart
            {cartItems.length > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <>
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  logoutHandler();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUser className="inline mr-2" /> Sign In
            </Link>
          )}
          
          {userInfo && userInfo.isAdmin && (
            <>
              <div className="px-3 py-2 font-semibold">Admin</div>
              <Link 
                to="/admin/userlist" 
                className="block px-3 py-2 ml-4 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser className="inline mr-2" /> Users
              </Link>
              <Link 
                to="/admin/productlist" 
                className="block px-3 py-2 ml-4 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart className="inline mr-2" /> Products
              </Link>
              <Link 
                to="/admin/orderlist" 
                className="block px-3 py-2 ml-4 rounded hover:bg-gray-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaClipboardList className="inline mr-2" /> Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 