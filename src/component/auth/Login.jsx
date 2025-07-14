import React, { useState, useEffect, useContext } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase_config';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase_config'; 
import { Authcontext } from '../../context/Authcontext';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [empty, setEmpty] = useState('');

  const {userSignin, setUser} = useContext(Authcontext);
  

  const handleLogin = async () => {
    if (email && password) {
      try {
        const user = await userSignin(email, password);
        if (user) {
          setEmail('');
          setPassword('');
          navigate('/todo');
          // localStorage.setItem("userEmail", user.email);

          // Get image URL and other user info
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser(userData);
            // console.log("User data:", userData);
            
            localStorage.setItem("userData", JSON.stringify(userData));
          } else {
            throw new Error("User profile not found");
          }
        } else {
          console.log("Not login.");
        }
      } catch (error) {
        console.log("Error Message: ", error.message)
        setEmail('');
        setPassword('');
        setError("Login failed. User may not be registered.");
        setTimeout(() => setError(''), 5000)

      }
    } else {
      console.log("Email and Password both are empty.")
      setEmpty("Enter both Email and Password");
      setTimeout(() => setEmpty(''), 5000)
    }
  }



  const handleLoginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google Login user: ", user)
      navigate('/todo', {
        state: {
          email: user.email
        },
        replace: true
      });
    } catch (error) {
      console.log('Login failed.')
    }
  }



  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: '#f0f2f5' }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 350, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Sign In
        </Typography>

        <TextField
          label="Email"
          required
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red",
              fontWeight: "bold"
            }
          }}
        />
        <TextField
          label="Password"
          required
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiFormLabel-asterisk": {
              color: "red",
              fontWeight: "bold"
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, textTransform: 'none' }}
          onClick={() => handleLogin()}
        >
          Sign In
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2, textTransform: 'none' }}
          onClick={() => handleLoginWithGoogle()}
        >
          <GoogleIcon sx={{ color: '#fff' }} /> Sign In With Google
        </Button>

        <Typography variant="subtitle1" color='error' component="p" sx={{ marginTop: '10px' }}>
          {error}
        </Typography>
        <Typography variant="subtitle1" color='error' component="p" sx={{ marginTop: '10px' }}>
          {empty}
        </Typography>
      </Paper>
    </Box>
  )
}

export default Login
