import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddUser from './components/AddUser';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Rankings from './components/Rankings';
import Game from './components/Game';
import MainPage from './components/MainPage';

function App() {
  // const isAuthenticated = useIsAuthenticated() // True if user has logged in
  // const auth = useAuthUser(); // User data: {username,emial,createdAt} To add fields go to Login
  // IDK how it works


  
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<AddUser />} />
        <Route path='/rankings' element={<Rankings />} />
        <Route path='/play' element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
