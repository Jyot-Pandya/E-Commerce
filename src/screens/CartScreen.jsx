import { useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
import { cartState, cartTotalState } from '../state/cartState';
import axios from 'axios';

const CartScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const qty = new URLSearchParams(location.search).get('qty') || 1;

  const [cartItems, setCartItems] = useRecoilState(cartState);
  const { itemsPrice, totalPrice } = useRecoilValue(cartTotalState);

  const addToCart = useRecoilCallback(({ set }) => async (id, qty) => {
    const { data } = await axios.get(`/api/products/${id}`);
    const item = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    };
    
    set(cartState, (oldCart) => {
        const existItem = oldCart.find((x) => x.product === item.product);
        if (existItem) {
            return oldCart.map((x) =>
            x.product === existItem.product ? item : x
            );
        } else {
            return [...oldCart, item];
        }
    });
  });

  useEffect(() => {
    if (id) {
      addToCart(id, Number(qty));
    }
  }, [id, qty, addToCart]);

  const removeFromCartHandler = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const updateQtyHandler = (item, qty) => {
    const newItem = { ...item, qty: Number(qty) };
    setCartItems(cartItems.map(i => i.product === item.product ? newItem : i));
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Your cart is empty. <Link to="/" className="underline">Go Back</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.product}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              to={`/product/${item.product}`}
                              className="text-gray-900 font-medium hover:text-gray-600"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.qty}
                          onChange={(e) => updateQtyHandler(item, e.target.value)}
                          className="border rounded p-2"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeFromCartHandler(item.product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="mb-4 flex justify-between">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={checkoutHandler}
              className="w-full mt-6 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen; 