import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUser, resetUserUpdate } from '../slices/userSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'; // Assuming you have a Message component

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('UserEditScreen rendering with userId:', userId);

  const {
    loading: loadingUserDetails,
    error: errorUserDetails,
    user: userDetails,
  } = useSelector((state) => {
    console.log('User details from state:', state.user);
    return state.user;
  });

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => {
    console.log('Update state:', {
      loading: state.user.loadingUpdate,
      error: state.user.errorUpdate,
      success: state.user.successUpdate
    });
    return {
      loading: state.user.loadingUpdate,
      error: state.user.errorUpdate,
      success: state.user.successUpdate,
    };
  });

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    console.log('useEffect running with:', {
      userInfo: userInfo ? 'exists' : 'missing',
      userDetails: userDetails ? 'exists' : 'missing',
      successUpdate
    });

    if (!userInfo || !userInfo.isAdmin) {
      console.log('User not admin, redirecting to login');
      navigate('/login');
      return;
    }

    if (successUpdate) {
      console.log('Update successful, redirecting to user list');
      dispatch(resetUserUpdate());
      navigate('/admin/userlist');
    } else {
      if (!userDetails || userDetails._id !== userId) {
        console.log('Fetching user details for:', userId);
        dispatch(getUserDetails(userId));
      } else {
        console.log('Setting form data from user details');
        setName(userDetails.name);
        setEmail(userDetails.email);
        setIsAdmin(userDetails.isAdmin);
      }
    }
  }, [dispatch, navigate, userId, userDetails, successUpdate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <div className="container mx-auto px-4">
      <Link to="/admin/userlist" className="inline-block mb-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit User</h1>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          
          {loadingUserDetails ? (
            <Loader />
          ) : errorUserDetails ? (
            <Message variant="danger">{errorUserDetails}</Message>
          ) : (
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-xl">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isadmin">
                  <input
                    type="checkbox"
                    id="isadmin"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="mr-2 leading-tight"
                  />
                  Is Admin
                </label>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Update
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEditScreen; 