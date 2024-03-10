function Navbar() {

    return (
        <header className="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
            <div className="flex-1 flex justify-between items-center">
                <a href="/" className="text-xl font-bold">WIQ</a>
            </div>
            <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                        <li><a className="md:p-4 py-3 px-0 block font-bold text-gray-600 hover:text-gray-900" href='/play' >Play</a></li>
                        <li><a className="md:p-4 py-3 px-0 block font-bold text-gray-600 hover:text-gray-900" href="/rankings">Rankings</a></li>
                        <li><a className="md:p-4 py-3 px-0 block font-bold text-sky-500 hover:text-sky-800" href="/login">Sign in</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar