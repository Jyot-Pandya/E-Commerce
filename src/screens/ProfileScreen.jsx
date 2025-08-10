import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState } from 'recoil';
import { 
    userInfoState, 
    userDetailsQuery,
    userUpdateProfileLoadingState,
    userUpdateProfileErrorState,
    userUpdateProfileSuccessState 
} from '../state/userState';
import { myOrdersListQuery } from '../state/orderState';
import Loader from '../components/Loader';
import axios from 'axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  const navigate = useNavigate();

  const userInfo = useRecoilValue(userInfoState);
  const userDetailsLoadable = useRecoilValueLoadable(userDetailsQuery('profile'));
  const { state: userDetailsState, contents: user } = userDetailsLoadable;
  
  const myOrdersLoadable = useRecoilValueLoadable(myOrdersListQuery);
  const { state: ordersState, contents: ordersContents } = myOrdersLoadable;
  const loadingOrders = ordersState === 'loading';
  const errorOrders = ordersState === 'hasError' ? ordersContents : null;
  const orders = ordersState === 'hasValue' ? ordersContents : [];

  const loading = useRecoilValue(userUpdateProfileLoadingState);
  const error = useRecoilValue(userUpdateProfileErrorState);
  const success = useRecoilValue(userUpdateProfileSuccessState);
  const setSuccess = useSetRecoilState(userUpdateProfileSuccessState);

  // TODO: Refactor orders
  // const { orders, loading: loadingOrders, error: errorOrders } = useSelector(
  //   (state) => state.order
  // );

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (userDetailsState === 'hasValue' && user) {
        setName(user.name);
        setEmail(user.email);
      }
      // TODO: Refactor orders
      // dispatch(listMyOrders());
    }
  }, [navigate, userInfo, userDetailsState, user]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(false), 3000);
    }
  }, [success, setSuccess]);

  const submitHandler = useRecoilCallback(({ set, snapshot }) => async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      set(userUpdateProfileLoadingState, true);
      set(userUpdateProfileErrorState, null);
      set(userUpdateProfileSuccessState, false);
      try {
        const currentUserInfo = await snapshot.getPromise(userInfoState);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUserInfo.token}`,
          },
        };
        const { data } = await axios.put('/api/users/profile', { id: user._id, name, email, password }, config);
        set(userUpdateProfileLoadingState, false);
        set(userUpdateProfileSuccessState, true);
        set(userInfoState, data); // Update user info in global state
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(userUpdateProfileLoadingState, false);
        set(userUpdateProfileErrorState, message);
      }
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">User Profile</h2>
        
        {message && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
            Profile Updated Successfully
          </div>
        )}
        
        {(loading || userDetailsState === 'loading') && <Loader />}
        
        <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 dark:bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-gray-500 transition duration-200"
          >
            Update
          </button>
        </form>
      </div>
      
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Orders</h2>
        
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {errorOrders?.message || 'An error occurred while loading orders'}
          </div>
        ) : ordersState === 'hasValue' && orders && orders.length === 0 ? (
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200 px-4 py-3 rounded">
            You have no orders
          </div>
        ) : ordersState === 'hasValue' && orders ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      TOTAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PAID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DELIVERED
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        ₹{order.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isPaid ? (
                          <span className="text-green-600 dark:text-green-400">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">Not Paid</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isDelivered ? (
                          <span className="text-green-600 dark:text-green-400">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">Not Delivered</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isCancelled ? (
                          <span className="text-red-600 dark:text-red-400 font-semibold">Cancelled</span>
                        ) : order.isDelivered ? (
                          <span className="text-green-600 dark:text-green-400 font-semibold">Delivered</span>
                        ) : order.isPaid ? (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">Processing</span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="bg-gray-800 dark:bg-gray-600 text-white py-1 px-3 rounded hover:bg-gray-700 dark:hover:bg-gray-500 transition duration-200"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileScreen; 