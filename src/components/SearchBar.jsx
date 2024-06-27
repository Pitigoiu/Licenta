import React, { useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

import { db } from "../firebase/config";

export default function SearchBar() {
  let ref = collection(db, "Lista Completa");
  const [searchRes, setSearchRes] = useState(null);
  const [searchBook, setSearchBook] = useState("");

  const handleSearch = async (e) => {
    setSearchBook(e.target.value);
    console.log(1);
    const searchRef = query(
      ref,
      where("Name", ">=", e.target.value),
      where("Name", "<=", e.target.value + "\uf8ff"),
      limit(5)
    );

    const snapshot = await getDocs(searchRef);
    const result = snapshot.docs.map((doc) => ({ ...doc.data() }));
    setSearchRes(result);
  };
  return (
    <div className="w-full pt-2 max-w-md">
      <div
        onMouseOut={() => setSearchRes(null)}
        className="flex items-center rounded-full text-xl  p-2"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchBook}
          onChange={handleSearch}
          className="flex-grow p-2 rounded-full bg-teal-100 focus:outline-none"
        />
      </div>

      {searchRes && (
        <ul className="bg-gray-300 mt-2 rounded-lg shadow-lg text-medium">
          {searchRes.map((item) => (
            <li
              key={Math.random()}
              className="p-2 border-b border-gray-200  cursor-pointer hover:bg-gray-500 hover:text-blue-500"
            >
              <a className="flex items-center " href={`/manga/${item.Id}`}>
                <img
                  alt="Missing"
                  src={item.ImageUrl}
                  className="w-20 h-20 mr-2"
                />
                <div className="">
                  <p className="text-xl">{item.Name}</p>
                  <p className="italic ">{item.Author}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
