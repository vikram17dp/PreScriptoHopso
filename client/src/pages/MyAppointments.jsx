import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const MyAppointments = () => {
  const { doctors, token, backendUrl, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
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

  const handlePayment = async (appointmentId) => {
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
  
      // Fetch the client secret from the backend
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (data.success && data.clientSecret) {
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: stripe.elements().create('card'),
          },
        })
        if (result.error) {
          toast.error(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          toast.success('Payment successful!');
          getUserAppointments();
        }
      } else {
        toast.error(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment initiation failed");
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
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && (
                <>
                  <button
                    onClick={() => handlePayment(item._id)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
