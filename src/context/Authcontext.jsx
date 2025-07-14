import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "../config/firebase_config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Authcontext = createContext();

const AuthcontextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const uploadToCloudinary = async (imageFile) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "manzoor_upload");
    data.append("cloud_name", "dpygiayf2");

    const res = await fetch("https://api.cloudinary.com/v1_1/dpygiayf2/image/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error("Image upload failed");
    }

    const result = await res.json();
    if (!result.secure_url) {
      throw new Error("No image URL returned from Cloudinary");
    }

    return result.secure_url;
  };

  const userReg = async (email, password, imageFile, name) => {
    try {
      if (!imageFile) throw new Error("Image is required");

      const imageUrl = await uploadToCloudinary(imageFile);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name,
        imageUrl,
      });

      alert("User registered with Cloudinary image.");
      return user;

    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };

  const userSignin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Signin error: Invalid credentials");
      throw error;
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login user: ", user);
      navigate('/todo');
      return user;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logOut = async () => {
  try {
    await signOut(auth);
    navigate("/login"); // or redirect wherever needed
  } catch (error) {
    console.error("Failed to log out:", error);
  }
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authValue = {
    user,
    loading,
    setUser,
    userReg,
    userSignin,
    handleLoginWithGoogle,
    logOut,
  };

  return (
    <Authcontext.Provider value={authValue}>
      {children}
    </Authcontext.Provider>
  );
};

export { Authcontext, AuthcontextProvider };
