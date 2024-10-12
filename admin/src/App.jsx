
import { useContext } from 'react';
import './App.css'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext.jsx';

function App() {
  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div>
      <ToastContainer/>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
