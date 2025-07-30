import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { navigate, user, logout } = useContext(Appcontext);
  
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to={"/"}>
        <img src="https://i.pinimg.com/736x/f8/98/bf/f898bfb34a80f0784e1417c86a096e13.jpg" className="w-30 h-20"/>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKdfIIMWUuHgu02v-jpWy2xzVQwjXUiIE0UQDUdyefBLK53dIRsjYhEECQZC417zComgs&usqp=CAU"
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="text-sm font-medium hidden md:block">
                {user.username}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">
                    {user.role} • {user.organization}
                  </div>
                </div>
                <Link
                  to="/todo"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  My Todos
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm sm:hidden z-50`}
      >
        {user ? (
          <>
            <div className="flex items-center gap-3 py-2 px-2 border-b border-gray-100 w-full">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKdfIIMWUuHgu02v-jpWy2xzVQwjXUiIE0UQDUdyefBLK53dIRsjYhEECQZC417zComgs&usqp=CAU"
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.username}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">
                  {user.role} • {user.organization}
                </div>
              </div>
            </div>
            
            <Link
              to="/todo"
              className="block w-full px-2 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              onClick={() => setOpen(false)}
            >
              My Todos
            </Link>
            
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="block w-full px-2 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="block w-full text-left px-2 py-3 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              navigate("/login");
            }}
            className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-lg text-center"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};