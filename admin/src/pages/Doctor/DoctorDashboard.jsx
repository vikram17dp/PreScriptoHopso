import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {dToken, getDashData, setDashData, dashData,Appointmentcancel ,AppointmentComplete} = useContext(DoctorContext);
  const {currency,slotsDateFormat} = useContext(AppContext)
  useEffect(()=>{
    if(dToken){
      getDashData()
    }
  },[dToken])
  return dashData && <div className='m-5'>
  <div className='flex flex-wrap gap-3'>
  <div className='flex items-center bg-white min-w-52 rounded border-2 p-4 border-gray-100 cursor-pointer hover:scale-105 translate-all'>
    <img className='w-14' src={assets.earning_icon} alt="" />
      <div>
        <p className='text-xl font-semibold text-gray-600'>{currency}{dashData.earings}</p>
        <p className=' font-semibold text-gray-500'>Earnings</p>
      </div>
  </div>
  <div className='flex items-center bg-white min-w-52 rounded border-2 p-4 border-gray-100 cursor-pointer hover:scale-105 translate-all'>
    <img className='w-14' src={assets.appointments_icon} alt="" />
      <div>
        <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
        <p  className=' font-semibold text-gray-500'>Appointments</p>
      </div>
  </div>
  <div className='flex items-center bg-white min-w-52 rounded border-2 p-4 border-gray-100 cursor-pointer hover:scale-105 translate-all'>
    <img className='w-14' src={assets.patients_icon} alt="" />
      <div>
        <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
        <p  className=' font-semibold text-gray-500'>Patients</p>
      </div>
  </div>
  </div>
  <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0 '>
        {
              dashData.latestappointment.map((item,index)=>(
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                  <img className='rounded-full w-10' src={item.userData.image} alt="image" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                    <p className='text-gray-600'>{slotsDateFormat(item.slotDate)}</p>
                  </div>
                  {
                  item.cancelled ? <p className='text-red-500'>cancelled</p> : item.isCompleted ? <p className='text-green-500'>completed</p> :  <div className='flex'>
                  <img onClick={()=>Appointmentcancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={()=>AppointmentComplete(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
                }
                </div>
              ))

            }

        </div>
      </div>
</div>
};

export default DoctorDashboard;
