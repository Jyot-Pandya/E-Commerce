import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilCallback, useResetRecoilState } from 'recoil';
import { cartState, shippingAddressState, paymentMethodState, cartTotalState } from '../state/cartState';
import { 
    orderCreateLoadingState,
    orderCreateErrorState,
    orderCreateSuccessState,
    createdOrderState
} from '../state/orderState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  
  const shippingAddress = useRecoilValue(shippingAddressState);
  const paymentMethod = useRecoilValue(paymentMethodState);
  const cartItems = useRecoilValue(cartState);
  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = useRecoilValue(cartTotalState);

  const loading = useRecoilValue(orderCreateLoadingState);
  const error = useRecoilValue(orderCreateErrorState);
  const success = useRecoilValue(orderCreateSuccessState);
  const order = useRecoilValue(createdOrderState);
  
  const resetCart = useResetRecoilState(cartState);
  const resetCreatedOrder = useResetRecoilState(createdOrderState);
  const resetOrderCreateSuccess = useResetRecoilState(orderCreateSuccessState);
  const resetOrderCreateError = useResetRecoilState(orderCreateErrorState);

  // Clear any previous order states when component mounts
  useEffect(() => {
    resetCreatedOrder();
    resetOrderCreateSuccess();
    resetOrderCreateError();
  }, [resetCreatedOrder, resetOrderCreateSuccess, resetOrderCreateError]);

  // Redirect if shipping address is missing
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  // Redirect if order is placed successfully
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      resetCart();
    }
  }, [success, navigate, order, resetCart]);

  const placeOrderHandler = useRecoilCallback(({ set, snapshot }) => async () => {
    set(orderCreateLoadingState, true);
    set(orderCreateErrorState, null);
    set(orderCreateSuccessState, false);
    try {
        const userInfo = await snapshot.getPromise(userInfoState);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const orderData = {
            orderItems: cartItems,
            shippingAddress: { ...shippingAddress },
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        };
      const { data } = await axios.post('/api/orders', orderData, config);
      set(createdOrderState, data);
      set(orderCreateSuccessState, true);
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      set(orderCreateErrorState, message);
    } finally {
        set(orderCreateLoadingState, false);
    }
  });

  return (
    <div className='dark:text-white'>
      <h1 className="text-3xl font-bold mb-6">Place Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Shipping</h2>
            <p className="mb-2">
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
            <p className="mb-2">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>
          
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Order Items</h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
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
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{itemsPrice?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingPrice?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{taxPrice?.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₹{totalPrice?.toFixed(2)}</span>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <Button
                type="button"
                onClick={placeOrderHandler}
                className="w-full mt-4"
                disabled={cartItems.length === 0}
              >
                Place Order
              </Button>
              
              {loading && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen; 