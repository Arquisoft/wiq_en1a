import { Link } from 'react-router-dom'

function Navbar() {

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
                        <li><Link className="md:p-4 py-3 px-0 block font-bold text-sky-500 hover:text-sky-800" to="/login">Sign in</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar