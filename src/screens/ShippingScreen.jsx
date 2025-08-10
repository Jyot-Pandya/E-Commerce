import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { shippingAddressState } from '../state/cartState';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const ShippingScreen = () => {
  const shippingAddress = useRecoilValue(shippingAddressState);
  
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [errors, setErrors] = useState({});
  
  const setShippingAddress = useSetRecoilState(shippingAddressState);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShippingAddress({ address, city, postalCode, country });
      navigate('/payment');
    }
  };

  return (
    <div className="flex justify-center min-h-screen pt-8 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Shipping</h1>
        
        <form onSubmit={submitHandler} className="bg-card p-6 rounded-lg shadow-md space-y-4 border border-border">
          <Input
            type="text"
            label="Address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
            required
          />

          <Input
            type="text"
            label="City"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={errors.city}
            required
          />

          <Input
            type="text"
            label="Postal Code"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            error={errors.postalCode}
            required
          />

          <Input
            type="text"
            label="Country"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={errors.country}
            required
          />

          <Button
            type="submit"
            className="w-full"
            variant="default"
            size="lg"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen; 