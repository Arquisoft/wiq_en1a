import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddUser from './components/AddUser';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Rankings from './components/Rankings';
import MainPage from './components/MainPage';
import Game from './components/Game';
import { useEffect } from 'react';
import axios from 'axios';
import { createContext } from 'react';


export const UserContext = createContext();

function App() {
  
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
 
  
  const checkUser = async () => {
    try{
  

    const token = localStorage.getItem('uToken');
    if (token) {
      await axios.get(`${apiEndpoint}/self`, {
        headers: {
          Authorization: token,
        },
      }).then((response) => {
        console.log(response.data);
        setUser(response.data);
        setLoggedIn(true);
        return true;
      });
    }else{
      setUser(undefined);
      setLoggedIn(false);
      return false;
    }

    
  }catch (error) {
    // localStorage.setItem('uToken', '');
    // setUser({});
    // window.location.href = '/';
    setUser(undefined);
    console.log("hola");
    setLoggedIn(false);
    return false;
  }
  };
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser,checkUser,loggedIn }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<AddUser />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/play' element={<Game />} />
      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
