import { Link } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import {
    Collapse,
    IconButton,
} from "@material-tailwind/react";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
function NavbarDefault() {
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const navigate = useNavigate();
    function Logout() {
        signOut();
        navigate('/login');
    }

    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);
    const navList = (
       // <div class="hidden w-full md:block md:w-auto" >
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-#111827 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-#111827  bg-#111827 md:bg-#111827  border-gray-700">
            <li>
                <Link to="/play" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  text-white md:hover:text-blue-500  hover:bg-gray-700  hover:text-white md:hover:bg-transparent" aria-current="page">Play</Link>
            </li>
            <li>
                <Link to="/squads" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  text-white md:hover:text-blue-500  hover:bg-gray-700  hover:text-white md:hover:bg-transparent">Squads</Link>
            </li>
            <li>
                <Link to="/rankings" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  text-white md:hover:text-blue-500  hover:bg-gray-700  hover:text-white md:hover:bg-transparent">Rankings</Link>
            </li>
            {isAuthenticated() ? (
                <li><Link className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:hover:text-blue-500  text-white hover:bg-gray-700  hover:text-white md:hover:bg-transparent  border-gray-700" to="/userprofile">My Profile</Link></li>
            ) : ""}

        </ul>
       //</div>

    );

    return (

        <nav className="bg-#111827 border-gray-200  bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse transition-transform transform-gpu cursor-pointer hover:-translate-y-1 hover:shadow-lg">
                    <img src="/WIQProvFondo.png" className="h-8" alt="WIQ Logo"></img>
                    <Link to="/" className="self-center text-2xl font-semibold whitespace-nowrap  text-white ">WIQ</Link>
                </div>
                <div className="hidden lg:block ">{navList}</div>
                <div className="grid grid-cols-2 content-center justify-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {isAuthenticated() ? <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center  bg-blue-600  hover:bg-blue-700  focus:ring-blue-800" onClick={() => Logout()}>Log out</button> : <Link to="/login" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center  bg-blue-600  hover:bg-blue-700  focus:ring-blue-800" >Log In</Link>}

                    <IconButton
                        variant="text"
                        className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden justify-center content-center"
                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                    >{openNav ? (
                       <ClearRoundedIcon sx={{ color: "white" }}/>
                    ) : (
                        <MenuRoundedIcon sx={{ color: "white" }}/>
                        
                    )}
                    </IconButton>
                </div>            
                </div>
            <Collapse open={openNav}>
                <div className="container mx-auto my-auto justify-center content-center">
                    {navList}
                </div>
            </Collapse>
        </nav >
    )
}

export default NavbarDefault