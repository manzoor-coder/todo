import React, { useContext, useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Link, useNavigate } from "react-router-dom"
import GoogleIcon from '@mui/icons-material/Google';
import { Authcontext } from '../../context/Authcontext';


function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');

  const { userReg, user, loading, handleLoginWithGoogle } = useContext(Authcontext);

  // state: email, password, name, image, message
  // initialize them with useState...

  useEffect(() => {
    if (user) {
      navigate("/todo");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <span className="loading loading-dots loading-lg flex item-center mx-auto"></span>
    );
  }

  const handleSubmit = async () => {
    if (email && password && image && name) {
      try {
        await userReg(email, password, image, name);
        setEmail('');
        setPassword('');
        setName('');
        setImage('');
        setMessage('');
        navigate("/login");
        // localStorage.setItem("email")
      } catch (err) {
        setMessage("Registration failed: " + err.message);
      }
    } else {
      setMessage("Please fill all fields.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await handleLoginWithGoogle(); // from context
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

    

    const navigateToLogin = () => {
        navigate("/login");
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
                    Sign Up
                </Typography>

                <TextField
                    label="Full Name"
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold"
                        }
                    }}
                />

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

                <TextField
                    label=""
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
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
                    onClick={() => handleSubmit()}
                >
                    Sign Up
                </Button>

                <Typography variant='subtitle1' component='p' sx={{ marginTop: '10px', }}>
                    If you have already account then <Link to={"/login"}>login</Link>.
                </Typography>


                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, textTransform: 'none' }}
                    onClick={() => handleGoogleLogin()}
                >
                    <GoogleIcon sx={{ color: '#fff' }} /> Sign In With Google
                </Button>
                <Typography variant='subtitle1' component='p' color='error' sx={{ marginTop: '10px' }}>{message}</Typography>
            </Paper>
        </Box>
    );
}

export default Register;

