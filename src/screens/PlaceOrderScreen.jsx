import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, resetOrder } from '../slices/orderSlice';
import { clearCartItems, calculatePrices } from '../slices/cartSlice';
import Loader from '../components/Loader';
import { Button } from '@/components/ui/button';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems, itemsPrice, taxPrice, shippingPrice, totalPrice } = cart;
  
  const { order, success, error, loading } = useSelector((state) => state.order);

  // Redirect if shipping address is missing
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  // Calculate prices
  useEffect(() => {
    dispatch(calculatePrices());
  }, [dispatch, cartItems]);
  
  // Redirect if order is placed successfully
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(clearCartItems());
      dispatch(resetOrder());
    }
  }, [success, navigate, order, dispatch]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Place Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Shipping</h2>
            <p className="mb-2">
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
            <p className="mb-2">
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>
          
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-md">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
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