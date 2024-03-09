// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';

const AddUser = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const register = async () => {
    try {
      console.log(password, cpassword);
      if(password !== cpassword){
        throw new Error('Passwords do not match');
      }
      await axios.post(`${apiEndpoint}/adduser`, { email, username, password });
      localStorage.removeItem('uToken');
      window.location.href = '/login';
    } catch (error) {
      setError(true);
    }
  };


  return (
    <div
      className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Sign up</h1>
          <p className="mt-2 text-gray-500">Sign up below to access WIQ</p>
        </div>
        <div className="mt-5">
          <form action="">
            <div className="relative mt-6">
              <input type="email" name="email" id="email" placeholder="Email Address" className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"  onChange={(e) => setEmail(e.target.value)}/>
              <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
            </div>
            <div className="relative mt-6">
              <input type="text" name="username" id="username" placeholder="Username" className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"  onChange={(e) => setUsername(e.target.value)}/>
              <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Username</label>
            </div>
            <div className="relative mt-6">
              <input type="password" name="password" id="password" placeholder="Password" className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" onChange={(e) => setPassword(e.target.value)}/>
              <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
            </div>
            <div className="relative mt-6">
              <input type="password" name="cpassword" id="cpassword" placeholder="Confirm Password" className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" onChange={(e) => setCpassword(e.target.value)}/>
              <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Confirm Password</label>
            </div>
            <div className="my-6">
              <button type="submit" className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none" onClick={()=>{register()}}>Sign up</button>
            </div>
            <p className="text-center text-sm text-gray-500">Already have an account?
              <Link to="/login" component="button"
                className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">Sign in
              </Link>.
            </p>
          </form>
        </div>
      </div>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(false)} message={`Something is wrong...`} />
      )}
    </div>
    
  );
};

export default AddUser;