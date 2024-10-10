import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      <div className="">
        <img src={assets.logo} alt="" className="w-40 mb-5"/>
        <p className="w-full md:w-2/3 leading-6 text-gray-600">
          Heres an expanded version of that line: We are dedicated to serving
          you throughout the week, with our hospital open Monday to Friday from
          8:00 AM to 8:00 PM, ensuring comprehensive care during regular hours,
          and on Saturdays from 9:00 AM to 6:00 PM, to accommodate your
          healthcare needs on the weekend. Whether its for routine check-ups or
          urgent consultations, we are here to provide you with trusted medical
          care every step of the way.
        </p>
      </div>
      <div className="">
        <p className="text-xl font-medium mb-5">COMPANY</p>
        <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
        </ul>
      </div>
      <div className="">
        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
        <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
            <li>+91-98459-86945</li>
            <li>PreScripto@gmail.com</li>
        </ul>
      </div>
    </div>
      <div className="">
        <hr/>
        <p className="py-5 text-sm text-center">Copyright 2024 @ PreScripto - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
