import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const {aToken,setAToken} = useContext(AdminContext)
    const navigate = useNavigate();
    const logout = ()=>{
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }
  return (
    <div className='flex justify-between items-center  sm:px-10 py-4 px-4  border-b bg-white '>
      <div className='flex itmes-center  gap-2 text-xs '>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='pt-2 border px-3 rounded-full  border-gray-500 text-gray-600 py-3px'>{aToken ? 'Admin': 'Doctor'}</p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar
