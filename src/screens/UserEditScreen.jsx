import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  userInfoState,
  userDetailsQuery,
  userUpdateLoadingState,
  userUpdateErrorState,
  userUpdateSuccessState,
} from '../state/userState';
import Loader from '../components/Loader';
import Message from '../components/Message'; // Assuming you have a Message component
import axios from 'axios';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userInfo = useRecoilValue(userInfoState);
  const userDetailsLoadable = useRecoilValueLoadable(userDetailsQuery(userId));
  const { state: userDetailsStateValue, contents: userDetails } = userDetailsLoadable;

  const loadingUpdate = useRecoilValue(userUpdateLoadingState);
  const errorUpdate = useRecoilValue(userUpdateErrorState);
  const successUpdate = useRecoilValue(userUpdateSuccessState);
  const setSuccessUpdate = useSetRecoilState(userUpdateSuccessState);
  
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (successUpdate) {
      setSuccessUpdate(false);
      navigate('/admin/userlist');
    } else {
      if (userDetailsStateValue === 'hasValue' && userDetails) {
        if (!userDetails || userDetails._id !== userId) {
          // This case should not happen if selector works correctly
        } else {
            setName(userDetails.name);
            setEmail(userDetails.email);
            setIsAdmin(userDetails.isAdmin);
        }
      }
    }
  }, [navigate, userId, userDetails, successUpdate, userInfo, setSuccessUpdate, userDetailsStateValue]);

  const submitHandler = useRecoilCallback(({ set, snapshot }) => async (e) => {
    e.preventDefault();
    set(userUpdateLoadingState, true);
    set(userUpdateErrorState, null);
    set(userUpdateSuccessState, false);
    try {
      const currentUserInfo = await snapshot.getPromise(userInfoState);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUserInfo.token}`,
        },
      };
      await axios.put(`/api/users/${userId}`, { _id: userId, name, email, isAdmin }, config);
      set(userUpdateLoadingState, false);
      set(userUpdateSuccessState, true);
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      set(userUpdateLoadingState, false);
      set(userUpdateErrorState, message);
    }
  });

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
          
          {userDetailsStateValue === 'loading' ? (
            <Loader />
          ) : userDetailsStateValue === 'hasError' ? (
            <Message variant="danger">{userDetails?.message || 'An error occurred'}</Message>
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