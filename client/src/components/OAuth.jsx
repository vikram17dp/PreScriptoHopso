import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";  
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const { backendUrl, setToken} = useContext(AppContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const { displayName, email, photoURL } = result.user;

      try {
        const res = await axios.post(`${backendUrl}/api/user/google`, {
          name: displayName,
          email: email,
          image: photoURL
        });

        if (res.status === 200) {
          const { token } = res.data;
          localStorage.setItem("token", token);
          setToken(token);
        

          toast.success("Google login successful!");
          navigate("/");  
        } else {
          toast.error(res.data.message || "Google login failed.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Network error during Google login.");
      }

    } catch (error) {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="border border-primary text-white bg-primary w-full py-2 rounded-md text-base mt-2"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default OAuth;
