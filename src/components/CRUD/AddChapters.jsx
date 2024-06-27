import { ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export default function AddChapters() {
  const [chapter, setChapter] = useState("");
  const [name, setName] = useState("");
  const [dateRel, setDateRel] = useState("");
  const [number, setNumber] = useState(0);
  const [bookName, setBookName] = useState([]);
  const [exclusive, setExclusive] = useState(false);

  const [poze, setPoze] = useState([]);

  const q = query(
    collection(db, "Lista Completa"),
    where("Name", "==", `${name}`)
  );

  //create array with pictures
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setPoze(files);
  };
  const [idChapter, setIdChapter] = useState(0);
  //adding more picture
  async function add(e) {
    let time = new Date();
    let dateFrom = new Date(dateRel);
    e.preventDefault();
    if (dateFrom < time) {
      return alert("The date can't be placed in the past");
    }
    //insert picture in the storage
    let nameChapter = new Date().getTime();
    const nameIdChapter = bookName.at(idChapter).Id;
    //update the book
    console.log(idChapter);
    console.log("Book selected", bookName.at(idChapter));
    console.log(nameIdChapter, nameChapter);
    try {
      await setDoc(doc(db, `${nameIdChapter}`, `${nameChapter}`), {
        dataRelease: Date(dateRel),
        Id: nameChapter,
        name: chapter,
        numberPicture: poze.length,
        permission: [],
        exclusive: exclusive,
        views: 0,
      });

      console.log("Document updated successfully");
    } catch (error) {
      console.log(error);
      return;
    }
    const uploadTasks = [];
    poze.forEach((file) => {
      const imageRef = ref(
        storage,
        `${nameIdChapter}/${nameChapter}/${file.name}`
      );
      const uploadTask = uploadBytes(imageRef, file);
      uploadTasks.push(uploadTask);
    });

    // promise all the pictures
    try {
      await Promise.all(uploadTasks);
      console.log("All images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    // update the number of chapters
    const query = await getDocs(q);
    query.forEach((doc) => {
      setNumber(doc.data().numberChapter);
      console.log(doc.data());
    });
    setDoc(
      doc(db, "Lista Completa", `${nameIdChapter}`),
      { numberChapter: number + 1 },
      { merge: true }
    );
    setName("");
    setChapter("");
    setDateRel("");
    setPoze([]);
    setExclusive(false);
  }

  useEffect(() => {
    let ref1 = collection(db, "Lista Completa");
    let List = [];
    onSnapshot(ref1, (snap) => {
      snap.docs.forEach((doc) => {
        console.log(doc.data());
        List.push(doc.data());
      });
      setBookName(List);
      List = [];
    });
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-700 ">
      <div className="w-full max-w-3xl bg-white   rounded-lg shadow-lg p-6">
        <form onSubmit={add}>
          <div className="mb-4"></div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-xl text-gray-900">Chapter</label>
              {/* Chapter name */}
              <input
                className="  appearance-none border border-gray-300  rounded-md w-full py-2 px-3 text-gray-900     focus:outline-none focus:border-blue-500"
                placeholder="Enter the chapter name"
                required
                value={chapter}
                onChange={(e) => setChapter(e.target.value)} //create special handler for verification
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xl text-gray-900 ">Pictures</label>
              {/* Pictures */}
              <label className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300">
                <span className="mr-2">Upload File</span>
                <input
                  className="hidden"
                  id="pictures"
                  multiple
                  required
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </label>
              <p>
                {poze.map((p, i) => (
                  <span key={i}>{p.name} </span>
                ))}
              </p>
            </div>
            <div className="grid gap-2">
              <label className="text-xl text-gray-900 ">Select Book</label>
              {/* Select Name */}
              <select
                className="  appearance-none border border-gray-300   rounded-md w-full py-2 px-3 text-gray-900   leading-tight focus:outline-none focus:border-blue-500"
                id="book"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIdChapter(e.target.selectedIndex - 1);
                }}
              >
                <option></option>
                {bookName &&
                  bookName.map((book, i) => (
                    <option value={book.name} key={i}>
                      {book.Name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xl text-gray-900  ">Date of Release</label>
              {/* Upload Date */}
              <input
                className="  appearance-none border border-gray-300   rounded-md  py-2 px-3 text-gray-900   leading-tight focus:outline-none focus:border-blue-500"
                id="uploadDate"
                type="datetime-local"
                value={dateRel}
                min={Date()}
                onChange={(e) => setDateRel(e.target.value)}
                required
              />

              <label className="text-2xl pl-4">Exclusive</label>
              <input
                type="checkbox"
                value={exclusive}
                onChange={() => setExclusive(!exclusive)}
                className=" h-7 w-7 text-blue-500 border-gray-300  focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className="  bg-transparent hover:bg-gray-700 text-gray-900   font-semibold hover:text-white py-2 px-4 border border-gray-300   rounded transition duration-300"
                type="button"
              >
                Cancel
              </button>
              <button
                className="  bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-500 rounded transition duration-300"
                type="submit"
              >
                Upload
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
