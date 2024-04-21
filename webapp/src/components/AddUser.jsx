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
    
    <div class="bg-[#453873] w-full h-screen justify-center content-center">
      <div class="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl pt-3">
        <div class="flex flex-row gap-3 pb-4">
          <div>
            <img src="/favicon.ico" width="50" alt="Logo"></img>
          </div>
          <h1 class="text-3xl font-bold text-[#4B5563] text-[#4B5563] my-auto">WIQ</h1>

        </div>
        <div class="text-sm font-light text-[#6B7280] pb-8 ">Sign up for an account on WIQ.</div>
        <form class="flex flex-col">
          <div class="pb-2">
            <label for="username" class="block mb-2 text-sm font-medium text-[#111827]">Username</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span>
              <input type="text" name="username" id="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Username"   />
            </div>
          </div>
          <div class="pb-2">
            <label for="email" class="block mb-2 text-sm font-medium text-[#111827]">Email</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span>
              <input name="email" type='email' margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="name@example.com"   />
            </div>
          </div>
          <div class="pb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-[#111827]">Password</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg></span>
              <input name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autocomplete="new-password" />
            </div>
          </div>
          <div class="pb-6">
            <label for="cpassword" class="block mb-2 text-sm font-medium text-[#111827]">Confirm Password</label>
            <div class="relative text-gray-400"><span class="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"    stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg></span>
              <input name="cpassword" margin="normal" label="Confirm Password" type="password" value={cpassword} onChange={(e) => setcPassword(e.target.value)} placeholder="••••••••••" class="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autocomplete="new-password" />
            </div>
          </div>
          <button type="submit" class="w-full text-[#FFFFFF] bg-[#453873] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"onClick={addUser}>Sign Up</button>
          <div class="text-sm font-light text-[#6B7280] ">Already have an account? <Link to="/login" class="font-medium text-[#453873] hover:underline">Login</Link>

          </div>
        </form>
      </div >

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
      {
        error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )
      }
    </div>
    //</Container >
    
  );
};

export default AddUser;
