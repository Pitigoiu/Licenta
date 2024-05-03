import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function PictureElement() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  let ref = collection(db, "Lista Completa");

  // console.log(x);
  useEffect(() => {
    setLoading(true);

    onSnapshot(ref, (snap) => {
      let res = [];
      snap.docs.forEach((doc) => {
        res.push(doc.data());

        console.log(doc.data()); //get the id so that i can use it for reference at opening url
      });
      setImages(res);

      setLoading(false);
    });
  }, []);
  console.log(images);
  if (loading) return <div>Loading. . . </div>;

  return (
    <div className="flex flex-wrap justify-center">
      {images.map((i, index) => (
        <div key={index} className="w-1/2 p-2">
          <img
            src={i.ImageUrl}
            className="w-full rounded-lg mb-2 "
            style={{ width: `200px`, height: "200px" }}
          />
          <div className="flex pl-3  mb-2">
            <div className="text-base text-white">Small text 1</div>
            <div className="text-base text-white ">Small text 2</div>
            <div className="text-base text-white ">Small text 3</div>
            <div className="text-base text-white"></div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            <Link
              to={{
                pathname: `/manga/${i.Id}`,
                state: { data: 2 },
              }}
            >
              Read More
            </Link>
          </button>
        </div>
      ))}
    </div>
  );
}
