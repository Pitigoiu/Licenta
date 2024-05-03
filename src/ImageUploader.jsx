import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "./firebase/config";
import {
  ref as reference,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const ImageUploader = () => {
  const [images, setImages] = useState();
  const [document, setDocuments] = useState([]);
  let ref = collection(db, "Carti");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    // const files = Array.from(e.target.files);
    // const imageUrls = files.map((file) => URL.createObjectURL(file));
    // setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  async function handle() {
    let dat = new Date().toGMTString();
    let nrID = Math.floor(Math.random() * 1000000);

    //upload the picture first
    const nameImage = images.name.split(".").slice(0, -1).join(".");
    console.log(nameImage);
    await uploadBytes(
      reference(storage, `poze/${nrID}-${nameImage}/${nameImage}`),
      images
    )
      .then((snap) => {
        console.log("FileUploaded succesfully");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
    //

    const url = await getDownloadURL(
      reference(storage, `poze/${nrID}-${nameImage}/${nameImage}`)
    );
    console.log(url);

    //searching from the collection that i set to

    onSnapshot(ref, (snap) => {
      let res = [];
      snap.docs.forEach((doc) => {
        res.push({ ...doc.data() });
      });
      setDocuments(res);
      console.log(res);
    });
    let data = {
      id: `${nrID}-${nameImage}`,
      photoUrl: url,
      time: dat,
    };

    // in this method i can upload the file with the respected name and path

    const add = async () => {
      // await addDoc(ref, data);
      await setDoc(doc(db, "Carti", `${nrID}`), data);
    };

    add();
  }

  console.log(document);
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button className="bg-blue-500" onClick={handle}>
        Save
      </button>
      <div className="comment-container">
        <div className="image-container"></div>
      </div>
    </div>
  );
};

export default ImageUploader;
