import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorAppointments = () => {
    const {appointments,getAllappointments,dToken} = useContext(DoctorContext)
    useEffect(()=>{
        if(dToken){
            getAllappointments()
        }
    },[dToken])
  return (
    <div>
      DoctorAppointments
    </div>
  )
}

export default DoctorAppointments
