import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import {toast} from 'react-toastify'
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
const AddDoctor = () => {
    const [docImg,setDocImg] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFees] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [education, setEducation] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [about, setAbout] = useState("");
    const {backendUrl,aToken} = useContext(AdminContext);
    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        try {
            if(!docImg){
                return toast.error('Image Not Selected')
            }            
            const formData = new FormData()
            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('education',education)
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))
            formData.forEach((value,key)=>{
                console.log(`${key} : ${value}`);
                
            })
            const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                setDocImg('')
                setName('')
                setEmail('')
                setPassword('')
                setEducation('')
                setAbout('')
                setAddress1('')
                setAddress2('')
                setFees('')
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
       
       
    }
  return (
    <form className="m-5 w-full ">
      <p className="mb-3 text-lg font-semibold">Add Doctor</p>
      <div className="bg-white px-8 py-2 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll  ">
        <div className="flex items-center gap-4 mb-8 text-gray-800 ">
          <label htmlFor="doc-img">
            <img className="w-16 bg-gray-100 rounded-full cursor-pointer" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600 ">
            <div className="w-full lg:flex-1 flex-col gap-4 flex">
          <div className="flex-1 flex-col gap-1 flex">
            <p>Doctor name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="Name" required />
          </div>
          <div className="flex-1 flex-col gap-1 flex">
            <p>Doctor email</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="email" required />
          </div>
          <div className="flex-1 flex-col gap-1 flex">
            <p>Doctor password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder="password" required />
          </div>
          <div className="flex-1 flex-col gap-1 flex">
            <p>Experience</p>
            <select onChange={(e)=>setExperience(e.target.value)} value={experience} className="border rounded px-3 py-2" name="" id="">
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Year</option>
              <option value="3 Year">3 Year</option>
              <option value="4 Year">4 Year</option>
              <option value="5 Year">5 Year</option>
              <option value="6 Year">6 Year</option>
              <option value="7 Year">7 Year</option>
              <option value="8 Year">8 Year</option>
              <option value="9 Year">9 Year</option>
              <option value="10 Year">10 Year</option>
            </select>
          </div>

          <div className="flex-1 flex-col gap-1 flex">
            <p>Fees</p>
            <input onChange={(e)=>setFees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="Number" placeholder="fees" required />
          </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
          <div className="flex-1 flex-col gap-1 flex">
            <p>Speciality</p>
            <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className="border rounded px-3 py-2" name="" id="">
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>
          <div className="flex-1 flex-col gap-1 flex">
            <p>Education</p>
            <input onChange={(e)=>setEducation(e.target.value)} value={education} className="border rounded px-3 py-2" type="text" placeholder="Education" />
          </div>
          <div className="flex-1 flex-col gap-1 flex">
            <p>Address</p>
            <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="address1" required />
            <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder="address2" required />
          </div>
        </div>
        </div>
        <div >
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
          onChange={(e)=>setAbout(e.target.value)} value={about}
          className="w-full pt-2 border rounded"
            placeholder="write about doctor"
            rows={5}
            required
          ></textarea>
        </div>
        <button type="submit" 
        onClick={onSubmitHandler} className="bg-primary px-10 py-3 mt-4 rounded-full text-white">Add Doctor</button>
      
      </div>
    </form>
  );
};

export default AddDoctor;
