// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const addUser = async () => {
    try {
      if (password !== cpassword) {
        setError("Passwords do not match");
        return;
      }
      await axios.post(`${apiEndpoint}/adduser`, { username, email, password });
      setOpenSnackbar(true);
      navigate('/login');

    } catch (error) {
      if (error.response === undefined) {
        setError("There was a problem...");
      }
      else {
        setError(error.response.data.error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="content-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" style={{ height: "92.9vh" }}>
      <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }} className='bg-white rounded-xl content-center justify-center'>
        <h1 className='py-5 text-4xl font-bold text-[#111827]'>
          Register
        </h1>
        <TextField
          name="username"
          margin="normal"
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          name="email"
          type='email'
          margin="normal"
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          name="cpassword"

          margin="normal"
          fullWidth
          label="Confirm Password"
          type="password"
          value={cpassword}
          onChange={(e) => setcPassword(e.target.value)}
        />
        <div className='py-5 content-center justify-center'>
          <Button variant="contained" color="primary" className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={addUser}>
            Register
          </Button>
        </div>
        <Typography component="div" align="center" sx={{ marginTop: 2, marginBottom: 3 }}>
          <Link to="/login">Already have an account? Log in here.</Link>
        </Typography>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
        {
          error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )
        }
      </Container>
    </div>


  );
};

export default AddUser;
