import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { deleteObject, listAll, ref } from "firebase/storage";

export default function DeleteChapter() {
  const [chapter, setChapter] = useState("");
  const [chapters, setChapters] = useState([]);

  const [name, setName] = useState("");
  const [idBook, setIdBook] = useState();
  const [idChapter, setIdChapter] = useState();
  const [bookName, setBookName] = useState([]);

  const handleChapter = (e) => {
    setChapter(e.target.value);
    setIdChapter(chapters.at(e.target.selected).Id);
    console.log(chapters.at(e.target.selected).Id);
  };
  const changeName = async (e) => {
    if (e.target.value == "") return;
    //reupload the data after delete
    setName(e.target.value);
    setIdBook(bookName.find((x) => x.Name === e.target.value).Id);

    const q = collection(
      db,
      `${bookName.find((x) => x.Name === e.target.value).Id}`
    );
    const list = [];
    onSnapshot(q, (snap) => {
      snap.docs.forEach((doc) => {
        list.push(doc.data());
      });
      setChapters(list);
      console.log(list);
    });
  };
  useEffect(() => {
    let ref1 = collection(db, "Lista Completa");
    let List = [];
    onSnapshot(ref1, (snap) => {
      snap.docs.forEach((doc) => {
        List.push(doc.data());
      });
      setBookName(List);
    });
  }, []);
  useEffect(() => {
    if (!bookName) return;
  }, [bookName]);

  async function handleDelete(e) {
    e.preventDefault();

    //delete chapter
    const x = doc(db, `${idBook}`, `${idChapter}`);
    await deleteDoc(x);

    //delete from storage
    const deletRef = ref(storage, `${idBook}/${idChapter}`);
    const objects = await listAll(deletRef);
    const names = objects.items.map((item) => item.name);
    //it will automatically delete the folder
    for (const na of names) {
      console.log(na);
      const fileRef = ref(storage, `${idBook}/${idChapter}/${na}`);
      await deleteObject(fileRef);
    }
    //update Lista Completa
    const ref1 = doc(db, `Lista Completa`, `${idBook}`);

    // changeName(name);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <form id="form" onSubmit={handleDelete}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-gray-900 ">Select Name</label>
              {/* Select Name */}
              <select
                className=" appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-900  leading-tight focus:outline-none focus:border-blue-500"
                id="name Book"
                required
                value={name}
                onChange={changeName}
              >
                <option></option>
                {bookName &&
                  bookName.map((book, i) => (
                    <option key={i}>{book.Name}</option>
                  ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-gray-900 ">Delete Chapter</label>
              {/* Chapter name */}
              <select
                className=" appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-900  leading-tight focus:outline-none focus:border-blue-500"
                id="chapter Name"
                required
                value={chapter}
                onChange={handleChapter}
              >
                <option></option>v
                {chapters &&
                  chapters.map((ch, i) => <option key={i}>{ch.name}</option>)}
              </select>
              {/* <input
                className=" appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-900  leading-tight focus:outline-none focus:border-blue-500"
                placeholder="Enter the chapter name"
                required
                value={chapter}
                onChange={(e) => setChapter(e.target.value)} //create special handler for verification
              /> */}
            </div>
            <div className="grid gap-2"></div>

            <div className="flex items-center gap-2">
              <button
                className=" bg-transparent hover:bg-gray-700 text-gray-900  font-semibold hover:text-white py-2 px-4 border border-gray-300 rounded transition duration-300"
                type="button"
              >
                Cancel
              </button>
              <button
                className=" bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-500 rounded transition duration-300"
                type="submit"
              >
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
