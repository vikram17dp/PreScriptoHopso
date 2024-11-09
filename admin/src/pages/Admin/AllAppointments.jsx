import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const {aToken,getAllappointments,appointments,Appointmentcancel} = useContext(AdminContext)
  const {calculateAge,slotsDateFormat,currency} = useContext(AppContext)
  useEffect(()=>{
    if(aToken){
      getAllappointments()
    }
  },[aToken])
  return (
    <div className='w-full m-5 max-w-6xl'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date and Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item,index)=>(
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]  sm:grid items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-200'>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex gap-2 items-center'>
              <img className='w-8 rounded-full' src={item.userData.image} alt="userimage" /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotsDateFormat(item.slotDate)},{item.slotTime}</p>
            <div className='flex gap-2 items-center'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="userimage" /> <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {
              item.cancelled ? <p className='text-red-500 text-xs font-medium'>cancelled</p> :item.isCompleted ? <p className='text-green-500 text-xs font-medium' >completed</p>:<img  alt="icon" onClick={()=>Appointmentcancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
