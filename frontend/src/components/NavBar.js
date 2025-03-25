
const NavBar = () => {
   return <div>
    <nav className="border-b sticky top-0 bg-primary-900 text-primary-100 border-primary-800 z-10">
        <div className="h-14 max-w-7xl p-4 mx-auto flex items-center justify-between">
          GraphVis
          <ul className="hidden md:flex items-center justify-end space-x-4 text-sm font-medium">
            <li className="md:hover:underline">
              How To Use
            </li>
          </ul>
        </div>
      </nav>
   </div>
}

export default NavBar; 