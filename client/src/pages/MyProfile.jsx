import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const {
    userData,
    setUserDatauserData,
    setUserData,
    loadUserProfileData,
    backendUrl,
    token,
  } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const updateuserprofileData = async () => {
    try {
      const formdata = new FormData();
      formdata.append("name", userData.name);
      formdata.append("phone",userData.phone);
      formdata.append('address',JSON.stringify(userData.address))
      formdata.append('gender',userData.gender)
      formdata.append('dob',userData.dob)

      image && formdata.append('image',image)
      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formdata,{headers: {
        Authorization: `Bearer ${token}`
      }})
      if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setImage(false)
        setIsEdit(false)
      }else{
        toast.error(data.error)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Network error");
    }
  };
  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm text-left ">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 opacity-75 rounded"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              type="file"
              hidden
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image || ""} alt="" />
        )}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-700 px-2 py-1 mb-2 text-start"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline  mt-3">
            CONTACT INFORMATION
          </p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52 border border-gray-700 px-2 py-1 mb-2"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50 border border-gray-700 px-2 py-1 mb-2"
                  type="text"
                  value={userData.address?.line1 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-gray-50 border border-gray-700 px-2 py-1 mb-2"
                  type="text"
                  value={userData.address?.line2 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </p>
            ) : (
              <p>
                {userData.address?.line1}
                <br />
                {userData.address?.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline  mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                className="max-w-20 ng-gray-100 border border-gray-700 px-2 py-1 mb-2"
                name=""
                id=""
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}
            <p className="font-medium ">BirthDay</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100 border border-gray-700 px-2 py-1 mb-2"
                type="date"
                name=""
                id=""
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-400">{userData.dob}</p>
            )}
          </div>
        </div>
        <div>
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 mt-5  rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={ updateuserprofileData}
            >
              Save Infromation
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 mt-4 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
