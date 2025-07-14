
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, storage, db } from "../config/firebase_config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();


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
  console.log("Cloudinary upload result:", result);

  if (!result.secure_url) {
    throw new Error("No image URL returned from Cloudinary");
  }

  return result.secure_url;
};




const userReg = async (email, password, imageFile, name) => {
  try {
    if (!imageFile) throw new Error("Image is required");

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    // Register the user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
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
    console.error("Signin error: Invalid credential.");
    throw error;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem("authToken", result.accessToken)
    return user;
  } catch (error) {
    console.error("Google Sign-in Error:", error.message);
    throw error;
  }
};

// export { userReg, userSignin, signInWithGoogle };
