import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  orderDetailsQuery,
  orderPayLoadingState,
  orderPayErrorState,
  orderPaySuccessState,
  orderDeliverLoadingState,
  orderDeliverErrorState,
  orderDeliverSuccessState,
  orderDetailsRefetchState,
} from '../state/orderState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  
  const userInfo = useRecoilValue(userInfoState);
  const orderLoadable = useRecoilValueLoadable(orderDetailsQuery(orderId));
  const { state: orderState, contents: order } = orderLoadable;
  
  const loadingPay = useRecoilValue(orderPayLoadingState);
  const successPay = useRecoilValue(orderPaySuccessState);
  
  const loadingDeliver = useRecoilValue(orderDeliverLoadingState);
  const successDeliver = useRecoilValue(orderDeliverSuccessState);

  const setOrderDetailsRefetch = useSetRecoilState(orderDetailsRefetchState);
  const setSuccessPay = useSetRecoilState(orderPaySuccessState);
  const setSuccessDeliver = useSetRecoilState(orderDeliverSuccessState);

  useEffect(() => {
    if (successPay || successDeliver) {
      setSuccessPay(false);
      setSuccessDeliver(false);
      setOrderDetailsRefetch(v => v + 1);
    }
  }, [successPay, successDeliver, setSuccessPay, setSuccessDeliver, setOrderDetailsRefetch]);

  const payOrderCallback = useRecoilCallback(({ set }) => async (paymentResult) => {
    set(orderPayLoadingState, true);
    set(orderPayErrorState, null);
    set(orderPaySuccessState, false);
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
        set(orderPayLoadingState, false);
        set(orderPaySuccessState, true);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(orderPayLoadingState, false);
        set(orderPayErrorState, message);
    }
  });

  const paymentHandler = async () => {
    try {
      const { data: razorpayKey } = await axios.get('/api/config/razorpay');

      const { data: orderData } = await axios.post(
        '/api/payment/create-order',
        {
          amount: order.totalPrice,
          currency: 'INR',
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      const options = {
        key: razorpayKey.clientId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ProShop',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: function (response) {
          const paymentResult = {
            id: response.razorpay_payment_id,
            status: 'completed',
            update_time: new Date().toISOString(),
            payer: { email_address: userInfo.email },
          };
          payOrderCallback(paymentResult);
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  const deliverHandler = useRecoilCallback(({ set }) => async () => {
    set(orderDeliverLoadingState, true);
    set(orderDeliverErrorState, null);
    set(orderDeliverSuccessState, false);
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
        set(orderDeliverLoadingState, false);
        set(orderDeliverSuccessState, true);
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(orderDeliverLoadingState, false);
        set(orderDeliverErrorState, message);
    }
  });

  const downloadInvoiceHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: 'blob',
      };
      const { data } = await axios.get(`/api/orders/${orderId}/invoice`, config);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };
  
  if (orderState === 'loading') {
    return <Loader />;
  }
  if (orderState === 'hasError') {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{order?.message}</div>
  }

  if (!order) {
    return null; // Should be handled by loading/error state
  }

  order.itemsPrice = order.orderItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
                      {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{order.shippingPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{order.taxPrice}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₹{order.totalPrice}</span>
              </div>

              {order.isPaid && (
                <div className="mt-4">
                  <Button onClick={downloadInvoiceHandler} className="w-full">
                    Download Invoice
                  </Button>
                </div>
              )}

              {!order.isPaid && (
                <div className="mt-4">
                  {loadingPay && <Loader />}
                  {!loadingPay && (
                    <Button
                      onClick={paymentHandler}
                      className="w-full"
                    >
                      Pay with Razorpay
                    </Button>
                  )}
                </div>
              )}
              
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <div className="mt-4">
                  {loadingDeliver && <Loader />}
                  <Button
                    onClick={deliverHandler}
                    className="w-full"
                  >
                    Mark As Delivered
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen; 