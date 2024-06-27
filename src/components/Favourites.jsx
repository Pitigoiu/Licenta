import React, { useEffect, useState } from "react";
import { useAuth } from "./Auth/AuthContext";
import useUsers from "./hooks/useUsers";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function Favourites() {
  const { userLoggedIn, currentUser } = useAuth();
  const user = useUsers(userLoggedIn, currentUser.email);
  const [listManga, setListManga] = useState([]);
  const [listImg, setListImg] = useState([]);
  const [listChapter, setListChapter] = useState([]);

  useEffect(() => {
    user.then((data) => setListManga(data.favourites));
  });
  useEffect(() => {
    async function load() {
      let s = [],
        t = [];
      for (let list of listManga) {
        let ref = collection(db, list);
        let refChapter = query(ref, orderBy("dataRelease", "desc"), limit(2));
        const snapshot = await getDocs(refChapter);
        const dataSnapshot = snapshot.docs.map((doc) => ({ ...doc.data() }));
        t.push(dataSnapshot);
        let docImg = doc(db, "Lista Completa", list);
        const snap = await getDoc(docImg);
        s.push(snap.data());
      }
      setListChapter(t);
      setListImg(s);
    }
    load();
    if (!listManga.length) return;
  }, [listManga]);

  const handleRemove = async (id) => {
    await updateDoc(doc(db, "Users", currentUser.email), {
      favourites: arrayRemove(id.toString()),
    });
  };
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full bg-white text-xl">
        <div className="grid grid-cols-5 bg-gray-100 text-gray-600 py-2 px-4 font-semibold">
          <div>Image</div>
          <div>Name</div>
          <div>Chapters</div>
          <div>Published Date</div>
          <div>Actions</div>
        </div>
        {listChapter?.map((listC, i) => (
          <div
            key={listC?.Id}
            className="grid grid-cols-5 py-2 px-4 border-b border-gray-200 items-center"
          >
            <div className="flex justify-center">
              <img
                src={listImg[i]?.ImageUrl}
                alt="Book"
                className="w-28 h-28 object-cover"
              />
            </div>
            <div className="py-2 px-4 border-b hover:text-blue-400 border-gray-200 break-words whitespace-normal">
              <Link to={"/manga/" + listImg[i].Id + "-" + listImg[i]?.Name}>
                {listImg[i]?.Name}
              </Link>
            </div>
            {listC.map((list) => (
              <div key={list.Id + 1}>
                <div className="py-2 hover:text-red-300 px-4 border-b border-gray-200">
                  <Link to={`/manga/${listImg[i].Id}/${list.Id}`}>
                    {list?.name}
                  </Link>
                </div>
                <div className="py-2 px-4 border-b border-gray-200">
                  {list?.dataRelease?.slice(0, 21)}
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={() => handleRemove(listImg[i].Id)}
                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
