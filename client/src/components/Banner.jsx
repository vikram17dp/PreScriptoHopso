import React from 'react'
import { assets } from '../assets/assets'

const Banner = () => {
  return (
    <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-2 mr-10">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white ">
                <p className='mr-40'>Book Appointment</p>
                <p className='mt-4'>With100+Trusted Doctors</p>
            </div>
            <button className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all mr-[26vw]'>create account</button>
        </div>
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img src={assets.appointment_img} alt="" className='w-full absolute bottom-0 right-0 max-m-md' />
        </div>
    </div>
  )
}

export default Banner
