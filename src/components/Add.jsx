import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default function Add() {
  const [img, setImg] = useState(null);
  let re = collection(db, "Carti");
  const user = `${Math.random() * 10}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // upload picture inside the folder with the specific name
    const storage = getStorage();
    const imgRef = ref(storage, `poze/${user}/${img.name}`);
    await uploadBytes(imgRef, img);
    console.log(imgRef);
    //get the image url and insert at a specific collection/document
    getDownloadURL(ref(storage, `poze/${user}/${img.name}`))
      .then(async (url) => {
        await setDoc(doc(db, "Carti", user), {
          photoUrl: url,
        });
        console.log(url);
      })
      .catch((error) => {});
  };
  const handleFile = (e) => {
    setImg(null);
    let selected = e.target.files[0];
    console.log(selected);
    if (!selected.type.includes("image")) {
      return;
    }
    setImg(selected);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="file" onChange={handleFile} />
        <button className="text-white">Save</button>
      </div>
    </form>
  );
}
