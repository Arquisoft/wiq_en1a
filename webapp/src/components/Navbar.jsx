import { Link } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const navigate = useNavigate();
    function Logout() {
        signOut();
        navigate('/login');
    }

    return (
        <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
            <div className="flex-1 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">WIQ</Link>
            </div>
            <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                        <li><Link className="md:p-4 py-3 px-0 block font-bold text-gray-600 hover:text-gray-900" to='/play' >Play</Link></li>
                        <li><Link className="md:p-4 py-3 px-0 block font-bold text-gray-600 hover:text-gray-900" to="/rankings">Rankings</Link></li>

                        {isAuthenticated() && (
                            <li><Link className="md:p-4 py-3 px-0 block font-bold text-gray-600 hover:text-gray-900" to="/userprofile">UserProfile</Link></li>
                        )}
                        {isAuthenticated() ? <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg" onClick={() => Logout()}>
                            Logout
                        </button> 
                         : <li><Link className="md:p-4 py-3 px-0 block font-bold text-sky-500 hover:text-sky-800" to="/login">Sign in</Link></li>}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar