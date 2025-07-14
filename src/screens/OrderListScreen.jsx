import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { ordersListQuery } from '../state/orderState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const OrderListScreen = () => {
  const navigate = useNavigate();
  
  const ordersLoadable = useRecoilValueLoadable(ordersListQuery);
  const { state, contents: orders } = ordersLoadable;
  const loading = state === 'loading';
  const error = state === 'hasError' ? contents : null;

  const userInfo = useRecoilValue(userInfoState);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      // Data is fetched by the selector
    } else {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const exportHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: 'blob',
      };
      const { data } = await axios.get('/api/orders/export/csv', config);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={exportHandler}>Export to CSV</Button>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error?.message || 'An error occurred'}
        </div>
      ) : state === 'hasValue' && (
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
                {orders && orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user && order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{order.totalPrice}
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
                      >
                        <Button variant="outline">Details</Button>
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