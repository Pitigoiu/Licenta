import React from "react";
import ImageUploader from "../ImageUploader";
import PictureElement from "./PictureElement";

export default function ShowAll() {
  return (
    <div className="p-4 bg-gray-700">
      {/* <ImageUploader /> */}
      <PictureElement />
    </div>
  );
}
