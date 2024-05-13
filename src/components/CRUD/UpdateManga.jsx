import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function UpdateManga() {
  const [id, setId] = useState(0);
  const [status, setStatus] = useState("");
  const [bookName, setBookName] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAltName, setNewAltName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageShow, setImageShow] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newAuthor, setNewAuthor] = useState("");
  const [error, setError] = useState("");

  const [book, setBook] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageShow(reader.result);
        console.log(reader.result);
        setNewImage(e.target.files[0]);
      };
      reader.readAsDataURL(file);
    } else {
      setImageShow(null);
    }
  };

  const changeBook = async (e) => {
    //reupload the data after delete
    let nameBk;
    typeof e === "string" ? (nameBk = e) : (nameBk = e.target.value);
    console.log(e);
    console.log(bookName.find((x) => x.Name == nameBk).Id);
    const book = bookName[e.target.selectedIndex - 1];
    console.log(book);
    setNewAltName(book.AlternativeName);
    setNewAuthor(book.Author);
    setNewDescription(book.Description);
    setNewName(book.Name);
    setStatus(book.Status);
    setNewImage(book.ImageUrl);
    setId(book.Id);

    setBook(nameBk);
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
    console.log(bookName);
  }, [bookName]);
  let updateData = null;
  const saveData = () => {
    updateData = {
      AlternativeName: newAltName,
      Author: newAuthor,
      Description: newDescription,
      Name: newName,
      Status: status,
    };
    console.log(updateData);
  };

  async function handleUpdate(e) {
    e.preventDefault();
    if (updateData == null) {
      setError("Salvati pentru a continua");
      return;
    }
    const path = `ImageCover/${id}/${newImage.name}`;
    const imgRef = ref(storage, path);
    await uploadBytes(imgRef, newImage);
    console.log(id);

    await getDownloadURL(ref(storage, path))
      .then((url) => {
        console.log(url);
        updateData.ImageUrl = url;
      })
      .catch((e) => console.log(e.message));
    await updateDoc(doc(db, "Lista Completa", id.toString()), updateData);

    setNewAltName("");
    setBookName("");
    setNewName("");
    setId(0);
    setNewAuthor("");
    setNewDescription("");
    setStatus("");
    setNewImage(null);
    setImageShow(null);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700 ">
      <div className="rounded-lg border bg-white   shadow-sm w-full max-w-5xl p-10">
        <form id="form" onSubmit={handleUpdate}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-4xl font-medium text-gray-900 ">
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-3xl font-medium text-gray-900 ">
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
              </div>

              {(imageShow || newImage) && (
                <img
                  src={imageShow ? imageShow : newImage}
                  alt="Preview"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Change Name
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Change Name Author
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Change Alternative Name
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={newAltName}
                  onChange={(e) => setNewAltName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Change Status
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Change Genre
              </label>
              <input
                className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the name"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Change Description
              </label>
              <textarea
                className="w-full h-48 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              ></textarea>
            </div>
            {error && (
              <p className="text-2xl text-red-700 pl-4 font-bold">Aici</p>
            )}
            <div className="flex items-center gap-2">
              <button
                className=" bg-white hover:bg-green-700 hover:text-white text-2xl text-black font-semibold py-2 px-4 border border-blue-500 rounded-lg transition duration-300"
                type="button"
                onClick={saveData}
              >
                Save
              </button>
              <button
                className=" bg-blue-500 hover:bg-blue-700 text-2xl text-white font-semibold py-2 px-4 border border-blue-500 rounded-lg transition duration-300"
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
