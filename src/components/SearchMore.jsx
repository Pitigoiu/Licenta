import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function SearchMore() {
  let ref = collection(db, "Lista Completa");
  const [books, setBooks] = useState(null);
  const [filterBooks, setFilterBooks] = useState(null);
  const [genre, setGenre] = useState([]);
  const [order, setOrder] = useState("A-Z");
  const [nume, setNume] = useState("");
  const [autor, setAutor] = useState("");
  const handleChange = (e) => {
    setGenre([...genre, e.target.value]);
  };
  const dataFecth = async () => {
    const snapshot = await getDocs(ref);
    const result = snapshot.docs.map((doc) => ({ ...doc.data() }));
    setBooks(result);
  };
  useEffect(() => {
    dataFecth();
  }, []);

  useEffect(() => {
    if (!books) return;
  }, [books]);

  const fetchBooks = async () => {
    let sorted = [];

    let q;
    switch (order) {
      case "A-Z":
        if (genre.length == 0) {
          q = query(ref, orderBy("Name"), limit(10));
        } else {
          q = query(
            ref,
            orderBy("Name"),
            where("Genre", "array-contains-any", genre),
            limit(10)
          );
        }

        const snapshot1 = await getDocs(q);
        const result1 = snapshot1.docs.map((doc) => ({ ...doc.data() }));

        setFilterBooks(result1);
        break;
      case "Z-A":
        if (genre.length == 0) {
          q = query(ref, orderBy("Name", "desc"), limit(10));
        } else {
          q = query(
            ref,
            orderBy("Name", "desc"),
            where("Genre", "array-contains-any", genre),
            limit(10)
          );
        }
        const snapshot2 = await getDocs(q);
        const result2 = snapshot2.docs.map((doc) => ({ ...doc.data() }));

        setFilterBooks(result2);
        break;
      case "Last":
        if (genre.length == 0) {
          q = query(ref, orderBy("ReleaseDate"), limit(10));
        } else {
          q = query(
            ref,
            orderBy("ReleaseDate"),
            where("Genre", "array-contains-any", genre),
            limit(10)
          );
        }
        const snapshot3 = await getDocs(q);
        const result3 = snapshot3.docs.map((doc) => ({ ...doc.data() }));

        setFilterBooks(result3);
        break;
      case "First":
        if (genre.length == 0) {
          q = query(ref, orderBy("FirstRelease"), limit(10));
        } else {
          q = query(
            ref,
            orderBy("FirstRelease"),
            where("Genre", "array-contains-any", genre),
            limit(10)
          );
        }
        const snapshot4 = await getDocs(q);
        const result4 = snapshot4.docs.map((doc) => ({ ...doc.data() }));

        setFilterBooks(result4);
        break;
      case "Popular":
        setFilterBooks(books.sort((a, b) => a.Views - b.Views));
        break;
      default:
        setFilterBooks(books);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    fetchBooks();
  }
  function deleteGenre(e) {
    setGenre((prev) => prev.filter((_, index) => index !== e));
  }
  async function searchAfter(string) {
    let q;

    if (string == "Name")
      q = query(
        ref,
        where("Name", ">=", nume),
        where("Name", "<=", nume + "\uf8ff")
      );
    else
      q = query(
        ref,
        where("Author", ">=", autor),
        where("Author", "<=", autor + "\uf8ff")
      );
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({ ...doc.data() }));
    setFilterBooks(result);
  }
  return (
    <div className=" bg-gray-800 ">
      <div className=" flex items-center bg-gray-800 justify-center  p-6">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Advanced Book Search</h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="genre"
            >
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              onChange={handleChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option>Select a genre</option>
              <option value="Adventure">Adventure</option>
              <option value="Non">Non-fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mistery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Science">Science Fiction</option>
              <option value="Biography">Biography</option>
              <option value="Horror">Horror</option>
              <option value="History">History</option>
            </select>
            Selected options:
            {genre &&
              genre.map((g, i) => (
                <p key={g}>
                  <button
                    type="button"
                    className="pl-2 text-red-500 font-bold "
                    onClick={() => deleteGenre(i)}
                  >
                    {g}
                  </button>
                </p>
              ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Order
            </label>
            <select
              onChange={(e) => setOrder(e.target.value)}
              value={order}
              id="order"
            >
              <option value="A-Z">A-Z</option>
              <option value="Z-A"> Z-A</option>
              <option value="Last">Last Updated</option>
              <option value="First">First Updated</option>
              <option value="Popular">Popular</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Search
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-bold my-2">
              Cauta dupa Nume
            </label>
            <input
              type="text"
              id="name"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              className="flex-grow p-2  rounded-full bg-gray-300 text-xl text-red-700 font-semibold focus:outline-none"
            />
            <button
              onClick={() => searchAfter("Name")}
              type="submit"
              className="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cauta
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-bold my-2">
              Cauta dupa Autor
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              id="name"
              className="flex-grow p-2  rounded-full bg-gray-300 text-xl text-red-700 font-semibold focus:outline-none"
            />
            <button
              onClick={() => searchAfter("Autor")}
              type="submit"
              className="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cauta
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center bg-gray-800 min-h-screen ">
        {filterBooks &&
          filterBooks.map((i) => (
            <div key={i.Id} className="w-full sm:w-1/2 lg:w-1/2 p-2">
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
                      i.Genre.map((gen) => (
                        <div className="text-base p-2" key={Math.random()}>
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
    </div>
  );
}
