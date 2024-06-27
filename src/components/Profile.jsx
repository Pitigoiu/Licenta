import React, { useEffect, useState } from "react";
import { doPasswordChange, useAuthContext } from "./Auth/useAuthContext";
import useUsers from "./hooks/useUsers";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Profile() {
  const { userLoggedIn, currentUser } = useAuthContext();
  const userData = useUsers(userLoggedIn, currentUser.email);
  const [user, setUser] = useState({});
  useEffect(() => {
    userData.then((data) => {
      setUser(data);
      setName(data.name);
      setEmail(data.email);
      setPassword(data.password);
    });
  }, []);

  const [name, setName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [newPassword, setNewPassword] = useState("");
  const [banuti15, setBanuti15] = useState(false);
  const [banuti30, setBanuti30] = useState(false);
  const [banuti50, setBanuti50] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(" ");

  useEffect(() => {
    if (!user && !name && !email && !password && !profilePicture) {
      return;
    }
  }, [user, password, email, name]);

  const handleName = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "Users", email), {
      name: name,
    });
  };
  const handlePasword = async (e) => {
    e.preventDefault();
    try {
      doPasswordChange(email, password, newPassword)
        .then((x) => alert("Parola schimbata cu succes"))
        .catch((e) => console.log(e.message));
      if (password === newPassword)
        return alert("The new password can be the same like the last");
      await updateDoc(doc(db, "Users", email), {
        password: newPassword,
      });
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  };
  const handlePicture = async (e) => {
    e.preventDefault();
    const imageRef = ref(storage, `Users/${email}`);
    await uploadBytes(imageRef, profilePicture);
    let url = "";
    await getDownloadURL(ref(storage, `Users/${email}`))
      .then((URL) => {
        updateDoc(doc(db, "Users", email), {
          profile: URL,
        });
      })
      .catch((e) => console.log(e.message));
  };
  const changeName = (e) => {
    setName(e.target.value);
  };

  const changePassword = (e) => {
    if (!e.target.value) setPassword(user.password);
    setPassword(e.target.value);
  };
  // Introducere bani

  const banuti15L = () => {
    setBanuti15(!banuti15);
    localStorage.setItem("banuti", JSON.stringify(25));
    if (banuti15) localStorage.removeItem("banuti");
    if (banuti30) {
      setBanuti30(!banuti30);
      localStorage.removeItem("banuti");
    }
    if (banuti50) {
      setBanuti50(!banuti50);
      localStorage.removeItem("banuti");
    }
  };
  const banuti30L = () => {
    setBanuti30(!banuti30);
    localStorage.setItem("banuti", JSON.stringify(50));
    if (banuti30) localStorage.removeItem("banuti");
    if (banuti50) {
      setBanuti50(!banuti50);
      localStorage.removeItem("banuti");
    }
    if (banuti15) {
      setBanuti50(!banuti15);
      localStorage.removeItem("banuti");
    }
  };
  const banuti50L = () => {
    setBanuti50(!banuti50);
    localStorage.setItem("banuti", JSON.stringify(100));
    if (banuti50) localStorage.removeItem("banuti");
    if (banuti15) {
      setBanuti50(!banuti15);
      localStorage.removeItem("banuti");
    }
    if (banuti30) {
      setBanuti30(!banuti30);
      localStorage.removeItem("banuti");
    }
  };

  return (
    <div className=" bg-gray-600 min-h-screen flex justify-center items-center">
      <div className=" m-1 flex max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className=" m-1 w-1/2 pr-4">
          <h1 className=" m-1 text-3xl font-semibold mb-4">User Profile</h1>
          <img src={user.profile} alt="Poza Profil" />
          <form onSubmit={handleName}>
            <div className=" m-1 mb-4">
              <label
                htmlFor="name"
                className=" m-1 block text-2xl font-medium text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={changeName}
                className=" m-1 mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter your name"
              />
            </div>
            <button
              type="submit"
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>
          <div className=" m-1 mb-4">
            <label
              htmlFor="email"
              className=" m-1 block text-2xl font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled={true}
              value={email}
              className=" m-1 mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter your email"
            />
          </div>
          <form onSubmit={handlePasword}>
            <div className=" m-1 mb-4">
              <label
                htmlFor="password"
                className=" m-1 block text-2xl font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                // onChange={changePassword}
                className=" m-1 mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter your password"
              />
            </div>

            <div className=" m-1 mb-4">
              <label
                htmlFor="new-password"
                className=" m-1 block text-2xl font-medium text-gray-700"
              >
                New Password:
              </label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className=" m-1 mt-1 p-2 border border-gray-300 rounded-md w-full"
                placeholder="Enter new password"
              />
            </div>
            <button
              type="submit"
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update Password
            </button>
          </form>
          <form onSubmit={handlePicture}>
            <div className=" m-1 mb-4">
              <label htmlFor="picture" className="block text-gray-700 text-lg">
                Profile Picture
              </label>
              <label className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300">
                <span className="mr-2">Upload New Picture</span>
                <input
                  id="pictures"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="hidden m-1 mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
            </div>
            <button
              type="submit"
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Update Profile
            </button>
          </form>{" "}
        </div>
        <div className=" m-1 w-1/2 pl-4">
          <h1 className=" m-1 text-3xl font-semibold mb-4">
            Achizitionare banuti
          </h1>

          <div className=" m-1 mb-4">
            <button
              onClick={banuti15L}
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600 w-full mb-2"
            >
              15 lei = 25 banuti
            </button>
            {banuti15 && (
              <div>
                <stripe-buy-button
                  buy-button-id="buy_btn_1PCHuq2LMtSOMEwocUaiEHKA"
                  publishable-key="pk_test_51P6pHL2LMtSOMEwoS1opzlxMmuE9PjbmCh13b1t3h67HrUkgEW7taS1lXGdUuV4DQUMXSnBMs8D74demahZxHJRP00Uh3OlS8N"
                ></stripe-buy-button>
              </div>
            )}
            <button
              onClick={banuti30L}
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600 w-full mb-2"
            >
              30 lei = 50 banuti
            </button>
            {banuti30 && (
              <stripe-buy-button
                buy-button-id="buy_btn_1PCHwV2LMtSOMEwo8LjYzErr"
                publishable-key="pk_test_51P6pHL2LMtSOMEwoS1opzlxMmuE9PjbmCh13b1t3h67HrUkgEW7taS1lXGdUuV4DQUMXSnBMs8D74demahZxHJRP00Uh3OlS8N"
              ></stripe-buy-button>
            )}
            <button
              onClick={banuti50L}
              className=" m-1 bg-blue-500 text-white text-xl py-2 px-4 rounded-md hover:bg-blue-600 w-full mb-2"
            >
              50 lei = 100 banuti
            </button>
            {banuti50 && (
              <stripe-buy-button
                buy-button-id="buy_btn_1PCHWC2LMtSOMEwocbvUHC34"
                publishable-key="pk_test_51P6pHL2LMtSOMEwoS1opzlxMmuE9PjbmCh13b1t3h67HrUkgEW7taS1lXGdUuV4DQUMXSnBMs8D74demahZxHJRP00Uh3OlS8N"
              ></stripe-buy-button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
