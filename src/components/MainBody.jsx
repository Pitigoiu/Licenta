import React, { useEffect, useState } from "react";

import Carousel from "./Carousel";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function MainBody() {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [total, setTotal] = useState(0);
  let ref = collection(db, "Lista Completa");
  const q = query(ref, orderBy("ReleaseDate"));
  // const getBooks = async () => {
  //   const query = await getDocs(q);

  //   let list = [];
  //   query.forEach((doc) => {
  //     list.push(doc.data());
  //   });
  //   setLastVisible(query.docs[query.docs.length - 1]);
  //   console.log(lastVisible);
  //   setBooks(list);
  // };
  const totalBooks = async () => {
    const snap = await getCountFromServer(q);
    setTotal(snap.data().count);
    console.log(snap.data().count);
  };
  // useEffect(() => {
  //   getBooks();
  //   // click();
  // }, []);
  const fetchBooks = async (page = true) => {
    try {
      let x;
      if (page) {
        if (lastVisible)
          x = query(
            ref,
            orderBy("ReleaseDate"),
            startAfter(lastVisible),
            limit(9)
          );
        else {
          x = query(ref, orderBy("ReleaseDate"), limit(9));
        }
      } else {
        if (firstVisible) {
          x = query(
            ref,
            orderBy("ReleaseDate"),
            endBefore(firstVisible),
            limitToLast(9)
          );
        } else {
          x = query(ref, orderBy("ReleaseDate"), limit(9));
        }
      }
      const snapshot = await getDocs(x);

      const newDocuments = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setFirstVisible(snapshot.docs[0]);
      // console.log(newDocuments);
      setBooks(newDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    totalBooks();
  }, []);

  useEffect(() => {
    if (!books) return;
  }, [books, currentPage]);
  if (loading) return <div>Loading. . . </div>;

  const handlePageChange = (pageNumber, page) => {
    setCurrentPage(pageNumber);
    console.log(total / 10, pageNumber);
    fetchBooks(page);
  };
  return (
    <div>
      <Carousel />

      <div className="flex flex-wrap justify-center bg-gray-800 min-h-screen ">
        {books &&
          books.map((i, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <div className="flex bg-gray-200 rounded-lg shadow-lg m-4 p-2 hover:bg-gray-500 relative">
                <img
                  src={i.ImageUrl}
                  alt="Image missing"
                  className="w-1/2 sm:w-full rounded-lg mb-2 mr-2 sm:mr-0 "
                  style={{ maxWidth: `200px`, height: "200px" }}
                />
                <div className="w-1/2 pl-2 sm:w-full overflow-hidden">
                  <div className="text-lg font-semibold mb-1">
                    Name: {i.Name}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Number of Chapter: {i.numberChapter}
                  </div>
                  <div className="flex pl-3  mb-2">
                    {i.Genre &&
                      i.Genre.map((gen, i) => (
                        <div className="text-base p-2" key={i}>
                          {gen}
                        </div>
                      ))}
                  </div>
                  <div className="text-red-600  font-semibold text-lg pl-2">
                    {i.Description}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white px-4 py-2 mr-2 mb-2 rounded-md hover:bg-blue-600">
                  <Link to={`/manga/${i.Id}-${i.Name}`}>Read More</Link>
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between bg-red-500 text-2xl p-1 rounded-lg">
        <button
          onClick={() => handlePageChange(currentPage - 1, false)}
          disabled={currentPage === 1}
          className="text-white  px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-white px-2">Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1, true)}
          disabled={(total / 10) % 10 < currentPage}
          className="text-white  px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
