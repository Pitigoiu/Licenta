import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [image, setImage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const auth = getAuth();

  const handleImage = (e) => {
    let picture = e.target.files[0];
    console.log(picture);
    if (!picture.type.includes("image")) {
      return;
    }
    setImage(picture); //set image profile
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageRef = ref(storage, `Users/${email}`);
    await uploadBytes(imageRef, image);

    await getDownloadURL(ref(storage, `Users/${email}`))
      .then((URL) => {
        setDoc(doc(db, "Users", `${email}`), {
          name: name,
          email: email,
          password: password,
          profile: URL,
          admin: false,
          createdAt: new Date().toGMTString(),
          tokens: 0,
        });
      })
      .catch((e) => console.log(e.message));

    const auth = getAuth();
    try {
      if (!isRegistering) {
        setIsRegistering(true);

        // Create user account with email and password

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        console.log(userCredential);
        // Send email verification request
        // await sendEmailVerification(auth.currentUser);

        console.log(
          "User account created successfully. Verification email sent."
        );
      }
    } catch (error) {
      console.error("Error creating user account:", error.message);
    }
    if (userLoggedIn) return navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full sm:max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-8">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="picture" className="block text-gray-700 text-lg">
              Profile Picture
            </label>
            <label className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300">
              <span className="mr-2">Upload File</span>
              <input
                className="hidden"
                id="pictures"
                onChange={handleImage}
                type="file"
                accept="image/*"
              />
            </label>
          </div>
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-lg">
              Email
            </label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-lg">
              Password
            </label>
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="repeatPassword"
              className="block text-gray-700 text-lg"
            >
              Repeat Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => setPasswordRep(e.target.value)}
              value={passwordRep}
              id="repeatPassword"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mb-6 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 text-lg"
          >
            Sign Up
          </button>
        </form>
        <div className="flex justify-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
