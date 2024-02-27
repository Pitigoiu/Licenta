import React, { useEffect, useState } from "react";
import Poza from "./image/untitled.png";
import Poza1 from "./image/download.png";
import Poza2 from "./image/download1.png";
import Poza3 from "./image/download2.png";
import { db, storage } from "./firebase/config";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import MainBody from "./MainBody";

const images = [
  Poza1,
  Poza3,
  Poza2,
  Poza,
  Poza1,
  Poza2,
  Poza3,
  Poza,
  Poza1,
  Poza2,
  Poza3,
  Poza,
  Poza1,
  Poza2,
  Poza3,
  Poza,
];

export default function Carousel() {
  const [scrollPosition, setScrollPosition] = useState(0);

  //   useEffect(() => {
  //     let dat = new Date();
  //     const timer = setInterval(() => {
  //       setScrollPosition((prevPosition) => {
  //         const newPosition = prevPosition + 200;
  //         return newPosition >= (images.length - 8) * 200 ? 0 : newPosition;
  //       });
  //     }, 3000);
  //     //searching from the collection that i set to
  //     let ref = collection(db, "Carti");

  //     const unsub = onSnapshot(ref, (snap) => {
  //       let res = [];
  //       snap.docs.forEach((doc) => {
  //         res.push({ ...doc.data() });
  //       });
  //       setDocuments(res);
  //       console.log(res);
  //     });
  //     let data = {
  //       photoUrl:
  //         "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg",
  //     };
  //     const add = async () => {
  //       //await addDoc(ref, data);
  //       //   await setDoc(doc(db, "Carti", `${Math.random() * 10}`), data);
  //     };

  //     const show = onSnapshot(ref, (snap) => {
  //       let res = [];
  //       snap.docs.forEach((doc) => {
  //         console.log(doc.id); //get the id so that i can use it for reference at opening url
  //       });
  //     });

  //     return () => {
  //       clearInterval(timer);
  //       unsub();
  //       add();
  //       show();
  //     };
  //   }, []);

  const [documents, setDocuments] = useState(null);

  const goToNext = () => {
    console.log(documents);
    setScrollPosition((prevPosition) => {
      const newPosition = prevPosition + 200;
      return newPosition >= (images.length - 8) * 200 ? 0 : newPosition;
    });
  };
  const goToPrevious = () => {
    setScrollPosition((prevPosition) => {
      const newPosition = prevPosition - 200;
      return newPosition >= 0 ? newPosition : (images.length - 8) * 200;
    });
  };

  return (
    <div className="relative flex overflow-hidden justify-center bg-black py-2 ">
      <div
        className="flex"
        style={{
          width: `${images.length * 100}px`,
          transform: `translateX(-${scrollPosition}px)`,
          transition: "transform 800ms ease",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            style={{ width: `200px` }}
            className="max-w-xs rounded-lg shadow-lg"
          />
        ))}
      </div>
      {/* Button Back */}
      <button
        className={`absolute inset-y-0 left-0  w-12 h-12 bg-gray-800 text-white hover:opacity-30 top-1/2 transform -translate-y-1/2`}
        onClick={goToPrevious}
      >
        &lt;
      </button>
      {/* Forward Button */}
      <button
        className={`absolute inset-y-0 right-0  w-12 h-12 bg-gray-800 text-white hover:opacity-30 top-1/2 transform -translate-y-1/2`}
        onClick={goToNext}
      >
        &gt;
      </button>

      {/* Images */}
    </div>
  );
}
