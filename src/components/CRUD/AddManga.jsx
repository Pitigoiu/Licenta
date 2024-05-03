import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export default function AddManga() {
  /*nume:adauga nume manga
  alternativeName:nume secundar
  description:adauga descrire
  urlImage:adauga poza principala (creaza un storage poze carti/numele manga/poza.jpg
  Author:adauga autor/artist
  firstRelease:cand a aparut pentru prima data
  releaseDate:adauga data aparitie
  adauga data ultima aparitie
  status:adauga status
  genre: adauga genuri ()
  */
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState("");
  const [firstRelease, setFirstRelease] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [Id, setID] = useState();
  //genre should be array of more genres
  const [genre, setGenre] = useState([]);

  const [newBook, setNewBook] = useState({});
  const handleImage = (e) => {
    let picture = e.target.files[0];
    console.log(picture);
    if (!picture.type.includes("image")) {
      return;
    }
    setImage(picture);
  };

  async function handleSubmit(e) {
    setIsDisabled(!isDisabled);

    e.preventDefault();

    let time = new Date();
    let dateFrom = new Date(releaseDate);
    if (dateFrom < time) {
      return alert("The date can't be placed in the past");
    }
    console.log(image);
    let path = `ImageCover/${Id}/${image.name}`;

    //get url for the picture after submit
    const imgRef = ref(storage, path);
    await uploadBytes(imgRef, image);

    await getDownloadURL(ref(storage, path))
      .then((url) => {
        setDoc(doc(db, "Lista Completa", `${Id}`), {
          ...newBook,
          ImageUrl: url,
        });
        console.log(newBook);
      })
      .catch((e) => console.log(e.message));

    //create document for book
    setAltName("");
    setName("");
    setAuthor("");
    setDescription("");
    setGenre([]);
  }
  function saveData() {
    setIsDisabled(!isDisabled);
    let timeId = new Date().getTime();

    setID(timeId);
    setNewBook({
      Id: timeId,
      Name: name,
      AlternativeName: altName,
      Description: description,
      Author: author,
      FirstRelease: firstRelease,
      ReleaseDate: releaseDate,
      Genre: genre,
      Status: "ongoing",
      Views: 0,
    });
    console.log(newBook);
  }
  const handleGenres = (e) => {
    console.log(genre);

    setGenre([...genre, e.target.value]);
  };
  function deleteGenre(e) {
    console.log(e);
    setGenre((prev) => prev.filter((_, index) => index !== e));
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 ">
      <div className="rounded-lg border bg-white   shadow-sm w-full max-w-5xl p-10">
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold whitespace-nowrap tracking-tight text-4xl text-gray-900 ">
            Add media information
          </h3>

          <p className="text-3xl text-gray-500 ">
            Fill in the details below to add information about a media item.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Alternative Name
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the alternative name"
                  value={altName}
                  onChange={(e) => setAltName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Description
              </label>
              <textarea
                className="w-full h-48 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Image URL
              </label>
              <label className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300">
                <span className="mr-2">Upload File</span>
                <input
                  id="file-upload"
                  className="hidden"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImage}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Author
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the author"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  First Release
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  type="datetime-local"
                  value={firstRelease}
                  onChange={(e) => setFirstRelease(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Release Date
                </label>
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  type="datetime-local"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-3xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Genre
                </label>
                <select
                  className="border border-gray-300  rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:border-blue-500"
                  required
                  onChange={handleGenres}
                >
                  <option></option>
                  <option>Fantasy</option>
                  <option>Adventure</option>
                  <option>Horror</option>
                  <option>Reborn</option>
                </select>
                Selected options:
                {genre &&
                  genre.map((g, i) => (
                    <p key={i}>
                      {g}
                      <button type="button" onClick={(e) => deleteGenre(i)}>
                        X
                      </button>
                    </p>
                  ))}
                <input
                  className="w-full h-12 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the genre"
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 justify-end">
            <button
              type="button"
              onClick={saveData}
              className="text-xl font-medium rounded-md mr-4 bg-gray-500 text-white px-6 py-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className="text-xl font-medium rounded-md bg-gray-500 text-white px-6 py-2 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
