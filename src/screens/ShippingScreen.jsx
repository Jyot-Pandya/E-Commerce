import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { shippingAddressState } from '../state/cartState';

const ShippingScreen = () => {
  const shippingAddress = useRecoilValue(shippingAddressState);
  
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  
  const setShippingAddress = useSetRecoilState(shippingAddressState);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Shipping</h1>
        
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="postalCode">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen; 