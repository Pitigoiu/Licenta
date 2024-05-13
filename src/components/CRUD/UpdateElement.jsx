import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";

export default function UpdateElement() {
  const [chapter, setChapter] = useState("");
  const [chapters, setChapters] = useState([]);
  const [exclusive, setExclusive] = useState(false);
  const [newChapter, setNewChapter] = useState("");
  const [book, setBook] = useState("");
  const [poze, setPoze] = useState([]);
  const [linkPoze, setLinkPoze] = useState([]);
  const [bookName, setBookName] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [permission, setPermission] = useState("");
  const [listId, setListId] = useState([]);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setPoze(files);
  };
  const [idBook, setIdBook] = useState("");
  const changeBook = async (e) => {
    //reupload the data after delete
    let nameBk;
    typeof e === "string" ? (nameBk = e) : (nameBk = e.target.value);
    console.log(e);
    setIdBook(bookName.find((x) => x.Name == nameBk).Id);
    console.log(bookName.find((x) => x.Name == nameBk).Id);
    setBook(nameBk);

    const q = collection(db, `${bookName.find((x) => x.Name == nameBk).Id}`);
    const list = [];
    const listIdDoc = [];
    onSnapshot(q, (snap) => {
      snap.docs.forEach((doc) => {
        console.log(doc.data());
        listIdDoc.push(doc.id);
        list.push(doc.data());
      });
      setListId(listIdDoc);
      console.log(list);
      setChapters(list);
      console.log(chapters);
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
    if (!bookName.at(idChapter)) return;
    console.log(bookName);
  }, [bookName, linkPoze]);

  const handleChapter = async (chapterInfo) => {
    console.log(listId.indexOf(chapterInfo));
    console.log(chapters.at(chapters.find((x) => x === chapterInfo)).exclusive);
    setSpinner(true);
    setChapter(chapterInfo);
    console.log(chapterInfo);
    setExclusive(
      chapters.at(chapters.find((x) => x === chapterInfo)).exclusive
    );
  };
  const [idChapter, setidChapter] = useState(0);
  async function handleUpdate(e) {
    e.preventDefault();

    const permissionEmail = permission.split("\n");

    //update doc
    await updateDoc(
      doc(db, idBook.toString(), String(chapters.at(idChapter).Id)),
      {
        exclusive: exclusive,
        permission: arrayUnion(...permissionEmail),
        name: newChapter ? newChapter : chapter,
      }
    );
    // const chapterImages = ref(storage, `${book}/${chapter}`);
    // let list = [];
    // const imageList = await listAll(chapterImages);
    // for (const item of imageList.items) {
    // console.log(item.name);
    // const imageUrl = await getDownloadURL(item);
    // list.push({ name: item.name, url: imageUrl });
    // }   setLinkPoze(list);
    // console.log(list);
    //delete chapter
    // const x = doc(db, `${book}`, `${chapter}`);

    // //delete from storage
    // const deletRef = ref(storage, `${book}/${chapter}`);
    // const items = await listAll(deletRef);
    // const names = items.items.map((item) => item.name);
    // //it will automatically delete the folder
    // for (const na of names) {
    //   console.log(na);
    //   const fileRef = ref(storage, `${book}/${chapter}/${na}`);
    // }
    changeBook(book);
    setExclusive(false);
    setPermission("");
    setNewChapter("");
  }
  const handleCheck = (e) => {
    setExclusive(e.target.checked);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-700 ">
      <div className="w-full max-w-3xl bg-white   rounded-lg shadow-lg p-6">
        <form id="form" onSubmit={handleUpdate}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-xl font-medium text-gray-900 ">
                Select Book
              </label>
              {/* Select Book */}
              <select
                className=" appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-900  leading-tight focus:outline-none focus:border-blue-500"
                id="name Book"
                value={book}
                onChange={changeBook}
              >
                <option></option>
                {bookName &&
                  bookName.map((book, i) => (
                    <option key={i}>{book.Name}</option>
                  ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xl font-medium text-gray-800 ">
                Select Chapter
              </label>
              {/* Chapter name */}
              <select
                className=" appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-900  leading-tight focus:outline-none focus:border-blue-500"
                id="chapter Name"
                // value={chapter}
                onChange={(e, i) => {
                  setidChapter(i);

                  handleChapter(bookName.at(i).Id);
                }}
              >
                <option></option>
                {chapters &&
                  chapters.map((ch) => <option key={ch.Id}>{ch.name}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xl font-medium text-gray-900 ">
                Pictures
              </label>
              {/* Pictures */}
              <label className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300">
                <span className="mr-2">Upload File</span>
                <input
                  className="hidden"
                  id="pictures"
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </label>
              {spinner && (
                <p className="text-sm font-weight-400 text-red-500">
                  {linkPoze.map((p, i) => (
                    <span key={i}>{p.name} </span>
                  ))}
                  {poze && poze.map((p, i) => <span key={i}>{p.name} </span>)}
                </p>
              )}{" "}
            </div>
            <div className="grid gap-2">
              <div className="space-y-2">
                <label className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Change Name Chapter
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="space-y-2">
                <label className="text-2xl px-4 pt-1">Exclusive</label>
                <input
                  type="checkbox"
                  checked={exclusive}
                  onChange={handleCheck}
                  className=" h-7 w-7 text-blue-500 border-gray-300  focus:ring-blue-400"
                />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <label className="text-2xl px4 pt1">
                    Permission
                    <textarea
                      value={permission}
                      onChange={(e) => setPermission(e.target.value)}
                      className="bg-gray-100"
                      rows={10}
                    ></textarea>
                  </label>
                </div>
              </div>
            </div>
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
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
