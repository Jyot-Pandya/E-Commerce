import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder, resetOrderPay } from '../slices/orderSlice';
import Loader from '../components/Loader';
import axios from 'axios';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [sdkReady, setSdkReady] = useState(false);
  
  const { order, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.user);
  
  // Calculate prices
  if (!loading && order) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ).toFixed(2);
  }

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || order._id !== id) {
      dispatch(resetOrderPay());
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, id, order]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder({ orderId: id, paymentResult }));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  ) : (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Shipping</h2>
            <p className="mb-2">
              <strong>Name: </strong> {order.user.name}
            </p>
            <p className="mb-2">
              <strong>Email: </strong>
              <a
                href={`mailto:${order.user.email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {order.user.email}
              </a>
            </p>
            <p className="mb-2">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Not Delivered
              </div>
            )}
          </div>
          
          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
            <p className="mb-2">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Paid on {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Not Paid
              </div>
            )}
          </div>
          
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Order Items</h2>
            
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex py-2 border-b last:border-b-0">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/product/${item.product}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {item.name}
                    </Link>
                    
                    <div>
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>${order.totalPrice}</span>
              </div>
              
              {!order.isPaid && (
                <div className="mt-4">
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
                      PayPal SDK Loading...
                      <p className="text-sm mt-2">
                        (In a real app, the PayPal payment button would appear here)
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  type="button"
                  className="w-full mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Mark As Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen; 