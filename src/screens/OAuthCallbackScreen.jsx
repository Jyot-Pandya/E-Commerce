import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../slices/userSlice';

const OAuthCallbackScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Get user info from token (JWT)
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const user = {
        _id: tokenData.id,
        token
      };
      
      // Store token in local storage
      localStorage.setItem('userInfo', JSON.stringify(user));
      
      // Update Redux state
      dispatch(login(user));
      
      // Redirect to profile page
      navigate('/profile');
    } else {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [dispatch, location, navigate]);

  return (
    <div className="flex justify-center items-center h-96">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallbackScreen; 