import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const PaymentForm = ({
  clientSecret,
  appointmentId,
  onPaymentSuccess,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    setIsProcessing(false);

    if (error) {
      toast.error(error.message);
      onClose(); // Close the payment popup on error
      console.log("Payment error:", error); // Log error details
    } else {
      onPaymentSuccess(paymentIntent);
      setIsPaymentSuccessful(true); // Set payment successful state
      toast.success("Payment successful!");
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      <button
        type="submit"
        className={`mt-4 py-2 px-4 rounded w-full ${
          isPaymentSuccessful ? "bg-green-600" : "bg-blue-600"
        } text-white ${
          isPaymentSuccessful ? "hover:bg-green-700" : "hover:bg-blue-700"
        } disabled:opacity-50`}
        disabled={!stripe || isProcessing || isPaymentSuccessful}
      >
        {isPaymentSuccessful
          ? "Payment Done!"
          : isProcessing
          ? "Processing..."
          : "Pay"}
      </button>

      {isPaymentSuccessful && (
        <div className="mt-2 text-center text-green-600">
          Your payment was successful!
        </div>
      )}
    </form>
  );
};

export default PaymentForm;
