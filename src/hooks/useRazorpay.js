import { useState } from 'react';
import API from '../utils/api';
import { toast } from 'sonner';

const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (orderDetails, onSuccess, onFailure) => {
    try {
      setLoading(true);

      const { amount, cartItems, deliveryDetails } = orderDetails;

      // Step 1: Create Razorpay order on backend
      console.log('🔷 Creating Razorpay order...', { amount });
      
      const orderResponse = await API.post('/payment/create-order', {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          customerId: localStorage.getItem('custId'),
          items: cartItems.length
        }
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, keyId } = orderResponse.data;
      console.log('✅ Razorpay order created:', orderId);

      // Step 2: Get customer details
      const custId = localStorage.getItem('custId');
      const userDataStr = localStorage.getItem('vardhaman_user');
      const userData = userDataStr ? JSON.parse(userDataStr) : {};

      // Step 3: Razorpay Checkout Options
      const options = {
        key: keyId, // Razorpay Key ID from backend
        amount: orderResponse.data.amount, // Amount in paise
        currency: 'INR',
        name: 'Vardhaman Jewels',
        description: 'Jewelry Purchase',
        image: '/logo.png', // Your logo
        order_id: orderId,
        
        // Pre-fill customer details
        prefill: {
          name: userData.name || 'Customer',
          email: userData.email || '',
          contact: deliveryDetails.phone || userData.mobile || ''
        },

        // Theme customization
        theme: {
          color: '#D4AF37' // Golden color
        },

        // Payment success handler
        handler: async (response) => {
          try {
            console.log('✅ Payment successful:', response);

            // Step 4: Verify payment on backend
            const verifyResponse = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems: cartItems,
              deliveryDetails: deliveryDetails,
              custId: custId
            });

            if (verifyResponse.data.success) {
              console.log('✅ Payment verified, order created:', verifyResponse.data.orderNo);
              toast.success('🎉 Payment successful! Order placed.');
              
              if (onSuccess) {
                onSuccess({
                  orderNo: verifyResponse.data.orderNo,
                  paymentId: verifyResponse.data.paymentId,
                  amount: verifyResponse.data.amount
                });
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error);
            toast.error('Payment verification failed');
            if (onFailure) onFailure(error);
          }
        },

        // Payment modal closed
        modal: {
          ondismiss: () => {
            console.log('⚠️ Payment modal closed');
            toast.warning('Payment cancelled');
            setLoading(false);
          }
        },

        // Payment notes
        notes: {
          address: deliveryDetails.address,
          city: deliveryDetails.city
        }
      };

      // Step 5: Open Razorpay Checkout
      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', (response) => {
        console.error('❌ Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        if (onFailure) onFailure(response.error);
        setLoading(false);
      });

      razorpayInstance.open();
      setLoading(false);

    } catch (error) {
      console.error('❌ Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      if (onFailure) onFailure(error);
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};

export default useRazorpay;
