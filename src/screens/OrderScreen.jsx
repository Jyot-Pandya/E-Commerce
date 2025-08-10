import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState, useResetRecoilState } from 'recoil';
import {
  orderDetailsQuery,
  orderPayLoadingState,
  orderPayErrorState,
  orderPaySuccessState,
  orderDeliverLoadingState,
  orderDeliverErrorState,
  orderDeliverSuccessState,
  orderDetailsRefetchState,
  orderCancelLoadingState,
  orderCancelErrorState,
  orderCancelSuccessState,
  createdOrderState,
  orderCreateSuccessState,
  clearOrderCacheState,
} from '../state/orderState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  
  const userInfo = useRecoilValue(userInfoState);
  const orderLoadable = useRecoilValueLoadable(orderDetailsQuery(orderId));
  const { state: orderState, contents: order } = orderLoadable;
  
  const loadingPay = useRecoilValue(orderPayLoadingState);
  const successPay = useRecoilValue(orderPaySuccessState);
  
  const loadingDeliver = useRecoilValue(orderDeliverLoadingState);
  const successDeliver = useRecoilValue(orderDeliverSuccessState);
  const loadingCancel = useRecoilValue(orderCancelLoadingState);
  const successCancel = useRecoilValue(orderCancelSuccessState);
  const errorCancel = useRecoilValue(orderCancelErrorState);
  const setOrderDetailsRefetch = useSetRecoilState(orderDetailsRefetchState);
  const setSuccessPay = useSetRecoilState(orderPaySuccessState);
  const setSuccessDeliver = useSetRecoilState(orderDeliverSuccessState);
  const setSuccessCancel = useSetRecoilState(orderCancelSuccessState);
  const setClearOrderCache = useSetRecoilState(clearOrderCacheState);
  
  // Reset order creation states to prevent showing old order data
  const resetCreatedOrder = useResetRecoilState(createdOrderState);
  const resetOrderCreateSuccess = useResetRecoilState(orderCreateSuccessState);

  useEffect(() => {
    // Clear any old order creation states when viewing an order
    resetCreatedOrder();
    resetOrderCreateSuccess();
    
    if (successPay || successDeliver) {
      setSuccessPay(false);
      setSuccessDeliver(false);
      setOrderDetailsRefetch(v => v + 1);
    }
     if (successCancel) {
      // Clear all order-related states when order is cancelled
      resetCreatedOrder();
      resetOrderCreateSuccess();
      setOrderDetailsRefetch(v => v + 1); // Force refresh of any cached order data
      setClearOrderCache(v => v + 1); // Clear all cached order data
      navigate('/');
      setSuccessCancel(false);
    }
  }, [successPay, successDeliver, successCancel, setSuccessPay, setSuccessDeliver, setOrderDetailsRefetch, setSuccessCancel, navigate, resetCreatedOrder, resetOrderCreateSuccess, setClearOrderCache]);

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
    const cancelOrderHandler = useRecoilCallback(({ set }) => async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      set(orderCancelLoadingState, true);
      set(orderCancelErrorState, null);
      set(orderCancelSuccessState, false);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
        set(orderCancelLoadingState, false);
        set(orderCancelSuccessState, true);
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(orderCancelLoadingState, false);
        set(orderCancelErrorState, message);
      }
    }
  });

  const paymentHandler = async (orderForPayment) => {
    try {
      const { data: razorpayKey } = await axios.get('/api/config/razorpay');

      const { data: orderData } = await axios.post(
        '/api/payment/create-order',
        {
          amount: orderForPayment.totalPrice,
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
    if (errorCancel) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{errorCancel}</div>
  }
  if (!order) {
    return null; // Should be handled by loading/error state
  }

  // To make the order object mutable before adding new properties
  const mutableOrder = { ...order };

  mutableOrder.itemsPrice = mutableOrder.orderItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-200">Order {mutableOrder._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">Shipping</h2>
            <p className="mb-2 dark:text-gray-300">
              <strong>Name: </strong> {mutableOrder.user.name}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Email: </strong>
                {mutableOrder.user.email}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Address: </strong>
              {mutableOrder.shippingAddress.address}, {mutableOrder.shippingAddress.city}{' '}
              {mutableOrder.shippingAddress.postalCode}, {mutableOrder.shippingAddress.country}
            </p>
            {mutableOrder.isDelivered ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Delivered on {new Date(mutableOrder.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Not Delivered
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">Payment Method</h2>
            <p className="mb-2 dark:text-gray-300">
              <strong>Method: </strong>
              {mutableOrder.paymentMethod}
            </p>
            {mutableOrder.isPaid ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Paid on {new Date(mutableOrder.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Not Paid
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">Order Items</h2>
            {mutableOrder.orderItems.length === 0 ? (
              <div className="text-center py-4">Your order is empty</div>
            ) : (
              <ul>
                {mutableOrder.orderItems.map((item, index) => (
                  <li key={index} className="border-b last:border-b-0 py-3">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded"/>
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="hover:underline dark:text-gray-300">
                          {item.name}
                        </Link>
                      </div>
                      <div className="w-48 text-right dark:text-gray-300">
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
            
            <div className="flex justify-between mb-2 dark:text-gray-300">
              <span>Items</span>
              <span>₹{mutableOrder.itemsPrice}</span>
            </div>
            
            <div className="flex justify-between mb-2 dark:text-gray-300">
              <span>Shipping</span>
              <span>₹{mutableOrder.shippingPrice}</span>
            </div>
            
            <div className="flex justify-between mb-2 dark:text-gray-300">
              <span>Tax</span>
              <span>₹{mutableOrder.taxPrice}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 dark:text-white">
              <span>Total</span>
              <span>₹{mutableOrder.totalPrice}</span>
            </div>
            
            {!mutableOrder.isPaid && (
              <div className="mt-6">
                  {loadingPay && <Loader />}
                    <Button
                    type="button"
                    onClick={() => paymentHandler(mutableOrder)}
                      className="w-full"
                    >
                      Pay with Razorpay
                    </Button>
                </div>
              )}
                 {!mutableOrder.isPaid && (
              <div className="mt-6">
                {loadingCancel && <Loader />}
                <Button
                  type="button"
                  onClick={cancelOrderHandler}
                  className="w-full"
                  variant="destructive"
                >
                  Cancel Order
                </Button>
              </div>
            )}
              
            {userInfo && userInfo.isAdmin && mutableOrder.isPaid && !mutableOrder.isDelivered && (
              <div className="mt-6">
                  {loadingDeliver && <Loader />}
                  <Button
                  type="button"
                    onClick={deliverHandler}
                    className="w-full"
                  >
                    Mark As Delivered
                  </Button>
                </div>
              )}

            <div className="mt-6">
              <Button
                type="button"
                onClick={downloadInvoiceHandler}
                className="w-full"
                variant="outline"
              >
                Download Invoice
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen; 