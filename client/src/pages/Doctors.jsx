import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const [showFilter,setShowFliter] = useState(false)


  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => applyFilter(), [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600 font-medium pt-4 text-left">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-6  ">
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFliter(prev=> !prev)}>Filter</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 cursor-pointer mt-14 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 border mb-3 border-gray-300 ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
          >
            General physician
          </p>
          <p
            className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 mb-3 border border-gray-300 ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
          >
            Gynecologist
          </p>
          <p
           className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 mb-3 border border-gray-300 ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
          >
            Dermatologist
          </p>
          <p
           className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 mb-3 border border-gray-300 ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
          >
            Pediatricians
          </p>
          <p
           className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 mb-3 border border-gray-300 ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
          >
            Neurologist
          </p>
          <p
           className={`w-[94vw] sm:w-auto rounded transition-all cursor-pointer-auto pl-3 py-1.5 pr-16 mb-3 border border-gray-300 ${speciality === 'Gastroenterologist' ? 'bg-indigo-100 text-black' : ""}`}
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
          >
            Gastroenterologist
          </p>
        </div>
        
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6 text-start">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mt-14 "
            >
              <img src={item.image} alt="" className="bg-blue-50" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>{" "}
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
