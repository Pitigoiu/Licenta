import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Carousel() {
  const [scrollPosition, setScrollPosition] = useState(-300);
  const [popular, setPop] = useState([]);
  let reference = collection(db, "Lista Completa");
  const q = query(reference, orderBy("FirstRelease"), limit(10));

  const getPopular = async () => {
    const query = await getDocs(q);
    let list = [];
    query.forEach((doc) => {
      list.push(doc.data());
    });
    setPop(list);
  };
  useEffect(() => {
    getPopular();
    // const timer = setInterval(() => {
    //   setScrollPosition((prevPosition) => {
    //     const newPosition = prevPosition + 300;
    //     return newPosition >= 900 ? -300 : newPosition;
    //   });
    // }, 3000);
    // return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!popular) return;
  }, [popular]);

  const goToNext = () => {
    setScrollPosition((prevPosition) => {
      const newPosition = prevPosition + 300;
      return newPosition >= 900 ? -300 : newPosition;
    });
  };
  const goToPrevious = () => {
    setScrollPosition((prevPosition) => {
      const newPosition = prevPosition - 300;
      return newPosition >= 0 ? newPosition : 1500;
    });
  };
  if (!popular) return <div>Loadind...</div>;
  return (
    <div className="relative flex overflow-hidden justify-center bg-gray-800 py-2  mx-auto">
      <div
        className="flex "
        style={{
          transform: `translateX(${-scrollPosition}px)`,
          transition: "transform 800ms ease",
        }}
      >
        {popular &&
          popular.map((pop, index) => (
            <div className="mr-4 ">
              <a href={`/manga/${pop.Id}`}>
                <img
                  key={index}
                  src={pop.ImageUrl}
                  alt={`Slide ${index + 1}`}
                  className=" h-56 w-80  max-w-xs rounded-lg shadow-lg"
                />
                <div className="bg-black text-center text-semibold text-xl bg-opacity-50 text-white p-2">
                  {pop.Name}
                </div>
              </a>
            </div>
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
    </div>
  );
}
