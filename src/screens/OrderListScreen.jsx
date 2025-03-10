import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';

// Placeholder for order list actions that would be in the orderSlice
const listOrders = () => ({ type: 'LIST_ORDERS' });

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Placeholder data (in a real app this would come from Redux state)
  const loading = false;
  const error = null;
  const orders = [
    {
      _id: '1',
      user: { name: 'John Doe' },
      createdAt: '2023-01-01T12:00:00Z',
      totalPrice: 99.99,
      isPaid: true,
      paidAt: '2023-01-02T12:00:00Z',
      isDelivered: false,
    },
    {
      _id: '2',
      user: { name: 'Jane Smith' },
      createdAt: '2023-01-03T12:00:00Z',
      totalPrice: 129.99,
      isPaid: true,
      paidAt: '2023-01-04T12:00:00Z',
      isDelivered: true,
      deliveredAt: '2023-01-05T12:00:00Z',
    },
    {
      _id: '3',
      user: { name: 'Sam Wilson' },
      createdAt: '2023-01-06T12:00:00Z',
      totalPrice: 149.99,
      isPaid: false,
      isDelivered: false,
    },
  ];
  
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
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
                    USER
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
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isPaid ? (
                        <span className="text-green-600">
                          {new Date(order.paidAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <i className="fas fa-times text-red-600"></i>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isDelivered ? (
                        <span className="text-green-600">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <i className="fas fa-times text-red-600"></i>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen; 