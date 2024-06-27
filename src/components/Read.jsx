import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState("");
  const [images, setImages] = useState([]);
  const [listChapter, setListChapter] = useState([]);
  const [chapterData, setChapterData] = useState();
  const { name, chapter } = exportId(location);
  const manga = localStorage.getItem("Manga");
  const [loading, setLoading] = useState(localStorage.getItem("Loading"));
  const [chapterSelected, setChapterSelected] = useState();
  const { currentUser, userLoggedIn } = useAuth();

  const userData = useUsers(userLoggedIn, currentUser?.email);
  const list = [];
  let reference = collection(db, `${name}`);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    userData.then((data) => setUser(data));
    const q = query(reference, orderBy("dataRelease", "desc"));
    getDocs(q).then((data) => setChapterData(data));
  }, []);
  useEffect(() => {
    if (!chapterData) return;
    if (!listChapter) return;
    console.log(loading);
    if (loading == "true") {
      loadImage();
      console.log(loading);
    }
    checkPermission();
  }, [chapterData, user, listChapter]);

  const loadImage = async () => {
    const chapterImages = ref(storage, `${name}/${chapter}`);
    const list = [];
    const imageList = await listAll(chapterImages);
    imageList.items.sort((a, b) => {
      let aNum = parseInt(a.name.split(".")[0], 10);
      let bNum = parseInt(b.name.split(".")[0], 10);
      return aNum - bNum;
    });
    for (const item of imageList.items) {
      const imageUrl = await getDownloadURL(item);
      list.push(imageUrl);
    }
    setImages(list);
  };

  const setLoadImage = () => {
    if (loading == true) {
      localStorage.setItem("Loading", false);
    } else {
      localStorage.setItem("Loading", true);
      setLoading(true);
    }
    console.log(loading);
  };
  //change chapter from list
  const changeChapter = (e) => {
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

    window.open(`/manga/${name}/${prevChapter.Id}`, "_self");
  };
  const nextChapter = () => {
    const nextChapter =
      listChapter[
        listChapter.indexOf(listChapter.find((x) => x.Id == chapter)) - 1
      ];

    window.open(`/manga/${name}/${nextChapter.Id}`, "_self");
  };

  const checkPermission = async () => {
    const refChap = doc(db, `${name}`, `${chapter}`);
    const docSnap = await getDoc(refChap);
    if (docSnap.exists()) {
      if (
        !docSnap.data().permission.includes(currentUser?.email) &&
        docSnap.data().exclusive
      ) {
        if (!user?.admin) {
          return navigate("/");
        }
      }
    }
  };

  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(true);
  const [viewed, setViewed] = useState(false);

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrolled = window.scrollY;

    const visibleHeight = windowHeight + scrolled;

    if (!viewed) {
      if (visibleHeight > document.documentElement.offsetHeight / 2) {
        setViewed(true);
        await updateDoc(doc(db, `${name}`, `${chapter}`), {
          Views: increment(1),
        });
        await updateDoc(doc(db, "Lista Completa", `${name}`), {
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

      if (doc.data().Id == chapter) {
        setChapterSelected(doc.data().name);
      }
    });
    setListChapter(list);

    const next = list.indexOf(list.find((x) => x.Id == chapter)) + 1;

    const prev = list.indexOf(list.find((x) => x.Id == chapter)) - 1;

    if (prev < 0) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
    if (next == list.length) {
      setIsPrev(true);
    } else {
      setIsPrev(false);
    }
  }, [chapterData]);
  // useEffect(() => {}, [listChapter]);
  return (
    <div className="bg-gray-900 min-h-screen pt-2">
      <div className="container mx-auto ">
        <div className="text-white flex text-xl justify-between p-3 m-2 tracking-widest shadow-cyan-500  border-2">
          <p>
            <Link to="/">Bird Reader </Link>- &gt;
          </p>
          <p>
            <Link to={`/manga/${manga}`}>{manga.split("-")[1]}</Link> -&gt;
          </p>
          <p>
            <Link to={`/manga/${manga}/${chapter}`}>{chapterSelected}</Link>
          </p>
        </div>
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
              className={`px-2 rounded-lg text-white ${
                loading ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={setLoadImage}
            >
              Apasa
            </button>
            <button className="bg-white  rounded-lg px-2" onClick={loadImage}>
              Afiseaza
            </button>
            <button
              disabled={isNext}
              onClick={nextChapter}
              className="btn btn-lg rounded-lg bg-gray-700 text-white hover:bg-gray-900 focus:ring-2 focus:ring-gray-600 px-4 py-2"
            >
              Next Chapter
            </button>
          </div>
          <div className="p-2 flex justify-center">
            <div className="grid grid-cols-auto-1 w-1/2">
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
