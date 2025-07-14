import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { paymentMethodState } from '../state/cartState';
import { Button } from '@/components/ui/button';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const setPaymentMethodState = useSetRecoilState(paymentMethodState);

  // Set Razorpay as the default and only payment method
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const submitHandler = (e) => {
    e.preventDefault();
    setPaymentMethodState(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Payment Method</h1>
        
        <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              You will be redirected to Razorpay to complete your payment.
            </p>
            <div className="border rounded p-4 bg-gray-200 dark:bg-gray-700">
              <input
                type="radio"
                id="razorpay"
                name="paymentMethod"
                value="Razorpay"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="razorpay" className="font-medium dark:text-gray-200">
                Razorpay
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen; 