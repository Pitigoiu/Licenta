import React from "react";
import Poza from "./image/untitled.png";
import Poza1 from "./image/download.png";
import Poza2 from "./image/download1.png";
import Poza3 from "./image/download2.png";
import Carousel from "./Carousel";
import NavBar from "./NavBar";
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
export default function MainBody() {
  return (
    <div>
      <Carousel />
      <div className="flex flex-wrap justify-center bg-black">
        {Array.from({ length: images.length }, (_, index) => (
          <div key={index} className="w-1/2 p-2">
            <div className="bg-white rounded-lg shadow-lg m-4">
              <img
                src={images[index]}
                alt={images[index % images.length].name}
                className="w-full rounded-lg mb-2 "
                style={{ width: `200px`, height: "200px" }}
              />
              <div className="text-lg font-semibold mb-1">
                {images[index % images.length].name}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {images[index % images.length].chapter}
              </div>
              <div className="flex pl-3  mb-2">
                <div className="text-base">Small text 1</div>
                <div className="text-base ">Small text 2</div>
                <div className="text-base ">Small text 3</div>
                <div className="text-base "></div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
