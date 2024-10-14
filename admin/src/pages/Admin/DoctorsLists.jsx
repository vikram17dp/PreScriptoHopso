import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsLists = () => {
  const {doctors,getAllDoctors,aToken,changeAvailblity} = useContext(AdminContext)
  useEffect(()=>{
    if(aToken){
      getAllDoctors();
    }
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-start font-semibold underline text-lg'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl cursor-pointer max-w-56 overflow-hidden group ' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                  <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                </div>
                <div className='mt-1 flex items-center gap-1 pl-4 mb-4  text-sm'>
                  <input type="checkbox" onChange={() => changeAvailblity(item._id)} checked={item.available} />
                  <p className='text-green-600'>Available</p>
                </div>
            </div>
          ))
        }
      </div>
      
    </div>
  )
}

export default DoctorsLists
