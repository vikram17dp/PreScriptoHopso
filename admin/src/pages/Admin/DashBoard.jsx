import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DashBoard = () => {
  const {aToken,dashData,
    getDashData,Appointmentcancel} = useContext(AdminContext)
    const {slotsDateFormat} = useContext(AppContext)
    useEffect(()=>{
      if(aToken){
        getDashData()
      }
    },[aToken])
  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
      <div className='flex items-center bg-white min-w-52 rounded border-2 p-4 border-gray-100 cursor-pointer hover:scale-105 translate-all'>
        <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className=' font-semibold text-gray-500'>Doctors</p>
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
              dashData.latestAppointment.map((item,index)=>(
                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                  <img className='rounded-full w-10' src={item.docData.image} alt="" />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                    <p className='text-gray-600'>{slotsDateFormat(item.slotDate)}</p>
                  </div>
                  {
              item.cancelled ? <p className='text-red-500 text-xs font-medium'>cancelled</p> : <img src={assets.cross_icon} alt="image" onClick={()=>Appointmentcancel(item._id)} className='bg-red-500 rounded-full w-6 cursor-pointer'/>
            }
                </div>
              ))

            }
        </div>
      </div>
    </div>
  )
}

export default DashBoard
