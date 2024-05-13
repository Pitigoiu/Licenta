import React, { useEffect, useState } from "react";

import Carousel from "./Carousel";
import { Link, Navigate, useParams } from "react-router-dom";

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import NestedView from "./comment-section/NestedView";
import { useAuth } from "./Auth/AuthContext";
import useUsers from "./hooks/useUsers";
import useBook from "./hooks/useBook";
export default function Manga() {
  const { id } = useParams();
  const { userLoggedIn, currentUser } = useAuth();
  const [others, setOthers] = useState([]);
  const path = id.split("-")[0];
  const userData = useUsers(userLoggedIn, currentUser?.email);

  const [data, setData] = useState([]);
  const [chapterList, setChapterList] = useState([]);

  let ref = collection(db, `${path}`);

  let refChapter = query(ref, orderBy("dataRelease", "desc"));
  let ref1 = doc(db, "Lista Completa", `${path}`);
  const q = query(
    collection(db, "Lista Completa"),
    where("Id", "==", `${path}`)
  );
  const lastBook = query(
    collection(db, "Lista Completa"),
    orderBy("ReleaseDate"),
    limit(6)
  );
  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await getDocs(lastBook);
      const n = snapshot.docs.map((dox) => ({ ...dox.data() }));

      setOthers(n);
    };
    fetchBooks();
  }, []);

  const [user, setUser] = useState(null);
  useEffect(() => {
    userData.then((data) => setUser(data));
  }, []);
  useEffect(() => {
    async function chapterData() {
      const snap = await getDocs(refChapter);
      let list = [];
      snap.forEach((doc) => {
        list.push(doc.data());
        console.log(user);
      });
      setChapterList(list);
    }
    chapterData();
  }, []);

  useEffect(() => {
    const informationBook = async () => {
      const docSnap = await getDoc(ref1);
      if (docSnap.exists()) {
        setData(docSnap.data());
        // console.log(docSnap.data());
      }
    };
    informationBook();
  }, []);

  const [viewExclusive, setViewExcluive] = useState({});

  useEffect(() => {
    function show() {
      for (let item in chapterList) {
        console.log(
          typeof chapterList[item].permission.find(
            (x) => x === currentUser?.email
          )
        );
        console.log(typeof currentUser?.email);

        if (user?.admin) {
          setViewExcluive((prev) => ({ ...prev, [item]: true }));
        } else if (
          chapterList[item].permission.find((x) => x === currentUser?.email) &&
          chapterList[item].exclusive
        ) {
          setViewExcluive((prev) => ({ ...prev, [item]: true }));
        }
        if (!chapterList[item].exclusive) {
          setViewExcluive((prev) => ({ ...prev, [item]: true }));
        }
      }
    }
    show();
  }, []);
  useEffect(() => {}, [data, user, others, chapterList]);
  const openImage = (url) => {
    window.open(url, "_blank");
    console.log(viewExclusive);
  };

  const handlePayment = async (idChapter) => {
    if (userLoggedIn && chapterList.at(id).permission) {
      let y = doc(db, "Users", `${currentUser.email}`);
      const userSnap = await getDoc(y);
      if (userSnap.exists) {
        alert("Acuared");
        // await setDoc(y, { tokens: user.tokens - 1 }, { merge: true });
        console.log(path, idChapter);
        await updateDoc(doc(db, `${path}`, `${idChapter}`), {
          permission: arrayUnion(currentUser.email),
        });
      }
    }
  };

  return (
    <div>
      <Carousel />
      <div className="flex text-black bg-gray-400  min-h-screen">
        {/* Sidebar */}
        <div className="w-1/4 p-3 h-72">
          {/* Sidebar Links */}
          <div className="text-2xl p-4 bg-gradient-to-r from-red-300 via-pink-200 to-gray-400">
            <h2 className="font-semibold mb-2 italic">Last Release</h2>
            <ul className="text-white">
              {others &&
                others.map((side, index) => (
                  <li key={index} className="mb-2">
                    <a
                      target="_self"
                      href={`/manga/${side.Id}-${side.Name}`}
                      className="text-red-500  hover:text-red-700"
                    >
                      {side.Name}
                    </a>
                  </li>
                ))}
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/4 p-4">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Main Title</h1>

          {/* Picture and 7 Paragraphs */}
          <div className="flex mb-4">
            <div className="w-1/2">
              {data && (
                <img
                  src={data.ImageUrl}
                  alt="Poza"
                  className="w-full h-full cursor-pointer object-contain rounded-lg"
                  style={{ width: "200px", height: "200px" }}
                  onClick={(e) => openImage(data.ImageUrl)}
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            {data.Description ? (
              <p>{data.Description}</p>
            ) : (
              <p>Description text goes here...</p>
            )}
          </div>

          {/* Scrollable List of Links */}
          <div className="max-h-60 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-2">
              You can purchase chapter just by clicking the lock. Be sure if you
              really want to pay.
            </h2>
            <h2 className="text-lg font-semibold mb-2">Links</h2>

            <ul>
              {chapterList.map((n, index) => (
                <li
                  key={n.Id}
                  className="flex items-center text-2xl justify-between"
                >
                  {/* Creaza o lista prin care sa verifica daca emailul este inclus si dupa afiseaza capitolele
                   */}

                  {viewExclusive[index] ? (
                    <>
                      <Link to={`/manga/${path}/${n.Id}`}>{n.name}</Link>
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          width="2rem"
                          height="2rem"
                        >
                          <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z" />
                        </svg>
                        <span>Views: {n.Views}</span>
                      </>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/manga/${path}/${n.Id}`}
                        className="  disabled opacity-50"
                        style={{ pointerEvents: "none" }}
                      >
                        {n.name}
                      </Link>

                      <svg
                        onClick={() => handlePayment(n.Id)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="2rem"
                        height="2rem"
                      >
                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
                      </svg>
                      <span>Views: {n.Views}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <NestedView id={path} manga={false} />
        </div>
        <div className="w-1/4 pt-4">
          {/* Paragraphs */}
          {[...Array(7)].map((_, index) => (
            <p key={index} className="mb-2">
              Paragraph {index + 1}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
