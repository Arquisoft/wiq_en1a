function Navbar() {

    return (
        <header class="lg:px-16 px-4 bg-white flex flex-wrap items-center py-4 shadow-md">
            <div class="flex-1 flex justify-between items-center">
                <a href="/" class="text-xl font-bold">WIQ</a>
            </div>
            <div class="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul class="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                        <li><a class="md:p-4 py-3 px-0 block" href='/play' >Play</a></li>
                        <li><a class="md:p-4 py-3 px-0 block" href="/rankings">Rankings</a></li>
                        <li><a class="md:p-4 py-3 px-0 block" href="/login">Sign in</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar