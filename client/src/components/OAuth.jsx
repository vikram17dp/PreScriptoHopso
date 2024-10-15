import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

const OAuth = () => {
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const { displayName, email, photoURL } = result.user;

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: displayName,
            email: email,
            image: photoURL
          })
        });

        const data = await res.json();
        if (res.ok) {
          console.log("User successfully authenticated and stored:", data);
        } else {
          console.error("Failed to authenticate user on the server", data);
        }
      } catch (error) {
        console.error("Error with server authentication:", error);
      }

    } catch (error) {
      console.error("Could not login with Google:", error);
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
