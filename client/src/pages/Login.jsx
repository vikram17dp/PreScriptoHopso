import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import OAuth from "../components/OAuth";

const Login = () => {
  const [state, setState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate(); 

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (state === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (response.data.success) {
          toast.success("Sign up successful! You can log in now.");
          setState("login"); 
          
        } else {
          toast.error(response.data.message || "Sign up failed.");
        }
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          toast.success("Login successful!");
          navigate("/"); 
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Network error");
    }
  };

  
  return (
    <form
      action=""
      className="min-h-[80vh] flex items-center"
      onSubmit={onSubmitHandler}
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:w-96 border rounded-xl text-zinc-600 text-sm shadow-lg text-left">
        <p className="font-semibold text-2xl">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign Up" : "log in"} to book an
          appointment.
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          className="bg-primary text-white w-full py-2 rounded-md text-base"
          type="submit"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
       <OAuth/>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")} // Update to 'login'
              className="text-primary underline cursor-pointer ml-1"
            >
              Login here
            </span>{" "}
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              className="text-primary underline cursor-pointer ml-1"
              onClick={() => setState("Sign Up")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
