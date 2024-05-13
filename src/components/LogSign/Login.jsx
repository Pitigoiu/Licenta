import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import {
  doPasswordReset,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../Auth/useAuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigninIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      if (!isSigningIn) {
        setIsSigninIn(true);
        await doSignInWithEmailAndPassword(email, password);
        localStorage.setItem("Logat", true);
      }
    } catch (error) {
      setErrorMessage(true);
      console.log(error.message);
    }
  };
  const [reset, setReset] = useState(false);
  const handleReset = () => {
    setReset(!reset);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log(resetEmail);
    localStorage.setItem("reset", `${resetEmail}`);
    try {
      await doPasswordReset(resetEmail);

      setResetEmail("");
      setReset(!reset);
    } catch (error) {
      setErrorMessage(true);
      console.log(error.message);
    }
  };
  return (
    <div>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <div className=" min-h-screen   flex items-center justify-center  bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="bg-gray-200 p-10 rounded-lg h-1/4 w-1/2  mt-4 ml-4 sm:w-1/2 ">
          <h2 className="text-3xl font-semibold text-center mb-8">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block font-bold text-gray-700 text-2xl"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="w-full font-semibold text-white px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block font-bold text-gray-700 text-2xl"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full font-semibold text-white px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              />
            </div>
            {errorMessage && (
              <p className="text-red-900 bg-green-100 text-xl rounded-lg p-1 mb-2">
                The password or the email are not correct.
              </p>
            )}
            <button
              type="submit"
              className="w-full font-bold bg-blue-500 text-white py-3 px-4 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-2xl"
            >
              Login
            </button>{" "}
          </form>
          <div className="flex justify-between">
            <a
              onClick={handleReset}
              href="#"
              className="text-white text-lg  hover:underline bg-green-500 rounded-lg p-2"
            >
              Forgot Password?
            </a>
            <a
              href="/singup"
              className="text-white text-lg  hover:underline bg-red-500 rounded-lg p-2"
            >
              Sign Up
            </a>
          </div>
          {reset && (
            <div className="mb-6  ">
              <form onSubmit={handleResetPassword}>
                <label
                  htmlFor="password"
                  className="block font-bold text-gray-700 text-2xl py-2"
                >
                  We will send a reset link to the following email:
                </label>
                <input
                  type="email"
                  id="emailReset"
                  required
                  onChange={(e) => setResetEmail(e.target.value)}
                  value={resetEmail}
                  className="w-full font-semibold text-white px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
