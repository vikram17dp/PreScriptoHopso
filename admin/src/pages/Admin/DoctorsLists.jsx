import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsLists = () => {
  const {doctors,getAllDoctors,aToken} = useContext(AdminContext)
  useEffect(()=>{
    if(aToken){
      getAllDoctors();
    }
  },[aToken])
  return (
    <div>
      
    </div>
  )
}

export default DoctorsLists
