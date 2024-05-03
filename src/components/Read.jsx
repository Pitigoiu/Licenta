import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { db, storage } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import NestedView from "./comment-section/NestedView";
import exportId from "./exportId";
import { useAuth } from "./Auth/AuthContext";
import useUsers from "./hooks/useUsers";

export default function Read() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]);
  const [listChapter, setListChapter] = useState([]);
  const [chapterData, setChapterData] = useState();
  const { name, chapter } = exportId(location);
  const [listIdChapters, setListIdChapters] = useState([]);
  const [chapterSelected, setChapterSelected] = useState();
  const { currentUser, userLoggedIn } = useAuth();
  const userData = useUsers(userLoggedIn, currentUser?.email);
  const list = [];
  let reference = collection(db, `${name}`);

  useEffect(() => {
    userData.then((data) => setUser(data));
  }, []);
  useEffect(() => {
    if (!user) return;
  }, [user]);

  useEffect(() => {
    const q = query(reference, orderBy("dataRelease", "desc"));
    getDocs(q).then((data) => setChapterData(data));
    a();
  }, []);
  useEffect(() => {
    if (!chapterData) return;
  }, [chapterData]);
  const apasa = async () => {
    const chaterImages = ref(storage, `${name}/${chapter}`);
    const list = [];
    const imageList = await listAll(chaterImages);
    for (const item of imageList.items) {
      const imageUrl = await getDownloadURL(item);
      list.push(imageUrl);
    }
    console.log(name, chapter);
    setImages(list);
  };
  //change chapter from list
  const changeChapter = (e) => {
    console.log(e.target.value);
    console.log(listChapter.find((x) => x.name == e.target.value).Id);
    window.open(
      `/manga/${name}/${listChapter.find((x) => x.name == e.target.value).Id}`,
      "_self"
    );
  };

  //change chapter from buttons
  const prevChapter = () => {
    const prevChapter =
      listChapter[
        listChapter.indexOf(listChapter.find((x) => x.Id == chapter)) + 1
      ];
    console.log(
      listChapter.indexOf(listChapter.find((x) => x.Id == chapter)) + 1
    );
    console.log(prevChapter);
    console.log(listChapter);
    window.open(`/manga/${name}/${prevChapter.Id}`, "_self");
  };
  const nextChapter = () => {
    // let nextChap = listChapter.indexOf(chapter);
    // console.log(nextChap);
    const nextChapter =
      listChapter[
        listChapter.indexOf(listChapter.find((x) => x.Id == chapter)) - 1
      ];
    console.log(
      listChapter.indexOf(listChapter.find((x) => x.Id == chapter)) - 1,
      chapter
    );
    window.open(`/manga/${name}/${nextChapter.Id}`, "_self");
  };

  const a = async () => {
    const refChap = doc(db, `${name}`, `${chapter}`);
    const docSnap = await getDoc(refChap);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      console.log(user.admin);
      if (
        !docSnap.data().permission.includes(currentUser?.email) &&
        docSnap.data().exclusive &&
        !user.admin
      ) {
        console.log("caca");
        // return navigate("/");
      }
    }
  };

  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(true);
  const [viewed, setViewed] = useState(false);

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const bodyHeight = document.documentElement.scrollHeight;

    const visibleHeight = windowHeight + scrolled;
    console.log(document.documentElement.offsetHeight);

    if (!viewed) {
      if (visibleHeight > document.documentElement.offsetHeight / 2) {
        console.log(viewed);
        setViewed(true);
        await updateDoc(doc(db, `${name}`, `${chapter}`), {
          Views: increment(1),
        });
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!chapterData) return;

    chapterData.forEach((doc) => {
      list.push(doc.data());
      console.log(doc.data());
      if (doc.data().Id == chapter) {
        setChapterSelected(doc.data().name);
      }
    });
    setListChapter(list);

    const next = list.indexOf(list.find((x) => x.Id == chapter)) + 1;
    console.log(list.indexOf(list.find((x) => x.Id == chapter)));
    const prev = list.indexOf(list.find((x) => x.Id == chapter)) - 1;
    console.log(next);
    console.log(prev);

    if (prev < 0) {
      setIsNext(true);
      console.log(isNext, isPrev);
    } else {
      setIsNext(false);
    }
    if (next == list.length) {
      setIsPrev(true);
      console.log(isNext, isPrev);
    } else {
      setIsPrev(false);
    }
  }, [chapterData]);
  useEffect(() => {}, [listChapter]);
  return (
    <div className="bg-gray-900 min-h-screen">
      <button className="bg-white  " onClick={apasa}>
        Apasa
      </button>
      <div className="container mx-auto ">
        <div className="comic-viewer ">
          <div className="flex justify-center space-x-4 ">
            <select
              value={chapterSelected}
              onChange={changeChapter}
              className="mt-4 mb-2 border border-gray-300 rounded-md py-1 px-2"
            >
              {listChapter.map((l, i) => (
                <option key={i}>{l.name}</option>
              ))}
            </select>
            <button
              onClick={prevChapter}
              disabled={isPrev}
              className="btn btn-lg rounded-lg bg-red-700 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 px-4 py-2"
            >
              Previous Chapter
            </button>
            <button
              disabled={isNext}
              onClick={nextChapter}
              className="btn btn-lg rounded-lg bg-gray-700 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 px-4 py-2"
            >
              Next Chapter
            </button>
          </div>
          <div className="flex justify-center p-2 ">
            <div className="grid grid-cols-auto-1 justify-center">
              {images &&
                images.map((i, index) => (
                  <img key={index} src={i} alt={`Flash Comic Page`} />
                ))}
            </div>
          </div>
          <div className="flex justify-center space-x-4 ">
            <select
              value={chapterSelected}
              onChange={changeChapter}
              className="mt-4 mb-2 border border-gray-300 rounded-md py-1 px-2"
            >
              {listChapter.map((l, i) => (
                <option key={i}>{l.name}</option>
              ))}
            </select>
            <button
              disabled={isPrev}
              onClick={prevChapter}
              className="btn btn-lg rounded-lg bg-red-700 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 px-4 py-2"
            >
              Previous Chapter
            </button>
            <button
              disabled={isNext}
              onClick={nextChapter}
              className="btn btn-lg rounded-lg bg-gray-700 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 px-4 py-2"
            >
              Next Chapter
            </button>
          </div>
        </div>
        <NestedView name={name} chapter={chapter} manga={true} />
      </div>
    </div>
  );
}
