import React, { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../App";

function Navbar() {
    const { user, setUser, loggedIn } = useContext(UserContext);
  
    const Logout = () => {
        setUser(undefined);
        localStorage.setItem('uToken', '');
        window.location.href = '/';
    }


    return (
        <header class="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
            <div class="flex-1 flex justify-between items-center">
                <a href="/" class="text-xl font-bold">WIQ</a>
            </div>
            <div>{loggedIn}
                
            </div>
            <div class="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul class="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                        <li><a class="md:p-4 py-3 px-0 block" href='/play' >Play</a></li>
                        <li><a class="md:p-4 py-3 px-0 block" href="/rankings">Rankings</a></li>
                        {loggedIn?<li><a class="md:p-4 py-3 px-0 block" onClick={Logout()}href="/">Log Out</a></li>:<li><a class="md:p-4 py-3 px-0 block" href="/login">Sign in</a></li>}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar