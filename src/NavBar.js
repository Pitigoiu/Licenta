import React from "react";

import Poze from "./image/untitled.png";
import { Link, Outlet } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="bg-white fixed top-0 left-0 right-0 z-10 max-w-7x1 mx-auto pb-2 px-5 sm:px-6 lg:px-8 relative">
      <div className="flex justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/">
            <img src={Poze} className="w-20 h-20" alt="Lipseste poza" />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-4">
              <div className="text-blue fs-3">
                <Link to="/manga">Component</Link>
              </div>
              <div className="text-blue fs-3">
                <Link to="/manga">Component</Link>
              </div>
              <div className="text-blue fs-3">
                <Link to="/manga">Component</Link>
              </div>
              <div className="text-blue fs-3">
                <Link to="/manga">Component</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Register Button/Search */}
        <div className="flex items-center">
          <input
            type="text"
            className="px-2 py-2 rounded-1-md focus:outline-none mr-4 rounded-md"
            placeholder="Search"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
            Login
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Register
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
