import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/userSlice';

const Header = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          ShopHub
        </Link>
        
        <form onSubmit={submitHandler} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              name="q"
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search Products..."
              className="w-full p-2 rounded text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-gray-700 rounded-r"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="flex items-center">
          <Link to="/cart" className="px-3 py-2 flex items-center">
            <i className="fas fa-shopping-cart mr-1"></i> Cart
            {cartItems.length > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="relative group ml-4">
              <button className="px-3 py-2 flex items-center">
                {userInfo.name} <i className="fas fa-caret-down ml-1"></i>
              </button>
              <div className="absolute right-0 w-48 bg-white rounded shadow-lg py-2 mt-1 invisible group-hover:visible z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 flex items-center ml-4">
              <i className="fas fa-user mr-1"></i> Sign In
            </Link>
          )}
          
          {userInfo && userInfo.isAdmin && (
            <div className="relative group ml-4">
              <button className="px-3 py-2 flex items-center">
                Admin <i className="fas fa-caret-down ml-1"></i>
              </button>
              <div className="absolute right-0 w-48 bg-white rounded shadow-lg py-2 mt-1 invisible group-hover:visible z-10">
                <Link
                  to="/admin/userlist"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Users
                </Link>
                <Link
                  to="/admin/productlist"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Products
                </Link>
                <Link
                  to="/admin/orderlist"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Orders
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 