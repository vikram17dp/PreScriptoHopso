
import { useContext } from 'react';
import './App.css'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Admin/DashBoard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorsLists from './pages/Admin/DoctorsLists.jsx';

function App() {
  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<DashBoard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorsLists/>}/>


        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
