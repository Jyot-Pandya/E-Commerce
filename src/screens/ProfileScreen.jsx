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
// import { listMyOrders } from '../slices/orderSlice'; // TODO: Refactor orders
import Loader from '../components/Loader';

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
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        
        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Profile Updated Successfully
          </div>
        )}
        
        {(loading || userDetailsState === 'loading') && <Loader />}
        
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Update
          </button>
        </form>
      </div>
      
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        
        {/* {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorOrders}
          </div>
        ) : orders && orders.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            You have no orders
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TOTAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PAID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DELIVERED
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders && orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${order.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <span className="text-green-600">
                            {order.paidAt.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="text-red-600">Not Paid</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <span className="text-green-600">
                            {order.deliveredAt.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="text-red-600">Not Delivered</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700"
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
        )} */}
      </div>
    </div>
  );
};

export default ProfileScreen; 