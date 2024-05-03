import React, { useState } from "react";
import { doPasswordChange } from "../components/Auth/useAuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const [errorMessage, setErrorMessage] = useState(false);
  const emailReco = localStorage.getItem("reset");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const navigate = useNavigate();
  if (emailReco == "") return navigate("/");
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email, emailReco);
    if (email !== emailReco) {
      setErrorMessage(!errorMessage);
      return;
    }
    try {
      await doPasswordChange(password);
      await updateDoc(doc(db, "Users", `${email}`), { password: password });
      localStorage.removeItem("reset");
      setConfirmation(true);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="bg-gray-200 p-10 rounded-lg h-1/4 w-1/2  mt-4 ml-4 sm:w-1/2 ">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Reset password
      </h2>
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
            The email is not correct.
          </p>
        )}
        <button
          type="submit"
          className="w-full font-bold bg-blue-500 text-white py-3 px-4 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-2xl"
        >
          Change password
        </button>
        {confirmation && (
          <p className="text-red-500 text-semibold p-2 bg-blue-200 rounded-lg text-2xl">
            Parola schimbata cu succes
          </p>
        )}
      </form>
    </div>
  );
}
