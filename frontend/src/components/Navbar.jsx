import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-6">
      <h1 className="text-3xl font-bold text-blue-500">
        Hirely
      </h1>

      <div className="space-x-6">
        <Link
          to="/"
          className="text-gray-300 hover:text-white"
        >
          Home
        </Link>

        <Link
          to="/dashboard"
          className="text-gray-300 hover:text-white"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;