import React, { useEffect, useState } from "react";

import Poze from "../image/untitled.png";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut, useAuthContext } from "./Auth/useAuthContext";
import useUsers from "./hooks/useUsers";

export default function NavBar() {
  const [showComponents, setShowComponents] = useState(false);
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuthContext();
  const [user, setUser] = useState({});
  const userData = useUsers(userLoggedIn, currentUser?.email);

  useEffect(() => {
    userData.then((data) => setUser(data));
  }, []);
  useEffect(() => {}, [user, userLoggedIn]);

  return (
    <div className="bg-white relative top-0 left-0 right-0 z-10 mx-auto pb-2 px-5 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/">
            <img src={Poze} className="w-20 h-20" alt="Missing image" />
          </Link>
        </div>
        {/* Toggle Button */}
        <div className="p-3 flex items-center">
          {userLoggedIn && (
            <div className="flex items-center">
              <div className="text-blue-500 rounded-lg bg-white text-2xl font-medium p-2 mr-4">
                <p>{user.tokens} banuti</p>
              </div>
              <div className="text-blue-500 rounded-lg bg-white text-2xl font-medium p-2 mr-4">
                <Link to="/profile">Profile</Link>
              </div>
              {user.admin && (
                <div className="text-blue-500 rounded-lg bg-white text-2xl font-medium p-2 mr-4">
                  <Link to="/admin">Admin</Link>
                </div>
              )}
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/");
                  });
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-blue text-2xl font-medium mr-4"
              >
                Logout
              </button>
            </div>
          )}
          {!userLoggedIn && (
            <div>
              <button className="bg-blue-500 mr-2 text-white px-4 py-2 rounded-md text-blue text-2xl font-medium">
                <Link to="/login">Login</Link>
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md text-blue text-2xl font-medium">
                <Link to="/signup">Register</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
