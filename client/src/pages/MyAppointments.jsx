import PaymentForm from '../components/PaymentForm'
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPopup = ({ clientSecret, appointmentId, onClose, onPaymentSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Your Stripe Payment</h2>
        <Elements stripe={stripePromise}>
          <PaymentForm 
            clientSecret={clientSecret}
            appointmentId={appointmentId}
            onPaymentSuccess={onPaymentSuccess}
            onClose={onClose}
          />
        </Elements>
        <button 
          onClick={onClose}
          className="mt-4 py-2 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const MyAppointments = () => {
  const { doctors, token, backendUrl, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const months = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const slotsDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error("No appointments found or take the appointments");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const initiatePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setCurrentAppointmentId(appointmentId);
        setIsPaymentPopupOpen(true);
      } else {
        toast.error(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment initiation failed");
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // console.log('Payment successful:', paymentIntent); // Log payment intent details
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-payment-status`,
        { appointmentId: currentAppointmentId, paymentIntentId: paymentIntent.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log('Payment status update response:', data); // Log response from backend
      if (data.success) {
        toast.success("Payment successful and appointment updated!");
        setIsPaymentPopupOpen(false);
        getUserAppointments(); // This should update the appointments state
      } else {
        toast.error(data.message || "Failed to update appointment status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update appointment status");
    }
  };
  
  

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-gray-700 border-b text-left">MyAppointments</p>
      <div>
        {appointments.slice(0, 3).map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
            <div>
              <img className="w-32 bg-indigo-50 rounded-lg" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {slotsDateFormat(item.slotDate)} | {item.slotTime}
              </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Status:</span> {item.paymentStatus || 'Pending'}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.paymentStatus !== 'paid' && (
                <>
                  <button
                    onClick={() => initiatePayment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-700 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                </>
              )}
              {item.cancelled && (
                <button className="sm:min-w-48 py-1 mb-2 border border-red-600 rounded text-red-500">
                  Appointment Cancelled
                </button>
              )}
              {item.paymentStatus === 'paid' && (
                <button className="sm:min-w-48 py-1 mb-2 border border-green-600 rounded text-green-500">
                  Payment Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isPaymentPopupOpen && clientSecret && (
        <PaymentPopup
          clientSecret={clientSecret}
          appointmentId={currentAppointmentId}
          onClose={() => setIsPaymentPopupOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default MyAppointments;