import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userInfoState } from '../state/userState';

const OAuthCallbackScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Get user info from token (JWT)
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const user = {
          _id: tokenData.id,
          name: tokenData.name, // Assuming name and isAdmin are in the token
          isAdmin: tokenData.isAdmin,
          token
        };
        
        // The localStorageEffect in userState.js will handle this
        setUserInfo(user);
        
        // Redirect to home page or profile
        navigate('/');
      } catch (error) {
        console.error("Failed to parse token or set user info", error);
        navigate('/login');
      }
    } else {
      // If no token, redirect to login page
      navigate('/login');
    }
  }, [location, navigate, setUserInfo]);

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