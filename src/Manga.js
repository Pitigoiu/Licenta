import React from "react";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import { Link } from "react-router-dom";
import Poza1 from "./image/download.png";
export default function Manga() {
  return (
    <div>
      <Carousel />
      <div className="flex flex-wrap text-white">
        {/* Sidebar */}
        <div className="w-1/4 p-4">
          {/* Sidebar Links */}
          <div className="text-2xl">
            <h2 className="text-lg font-semibold mb-2">Sidebar Links</h2>
            <ul>
              <li>
                <Link to="/">Link 1</Link>
              </li>
              <li>
                <Link to="/">Link 2</Link>
              </li>
              <li>
                <Link to="/">Link 3</Link>
              </li>
              <li>
                <Link to="/">Link 1</Link>
              </li>
              <li>
                <Link to="/">Link 2</Link>
              </li>
              <li>
                <Link to="/">Link 3</Link>
              </li>
              {/* Add more links as needed */}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-4">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">Main Title</h1>

          {/* Picture and 7 Paragraphs */}
          <div className="flex mb-4">
            <div className="w-1/2">
              <img src={Poza1} alt="Poza" className="w-62 g-64 rounded-lg" />
            </div>
            <div className="w-1/2 pl-4">
              {/* Paragraphs */}
              {[...Array(7)].map((_, index) => (
                <p key={index} className="mb-2">
                  Paragraph {index + 1}
                </p>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p>Description text goes here...</p>
          </div>

          {/* Scrollable List of Links */}
          <div className="max-h-60 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Links</h2>
            <ul>
              {[...Array(30)].map((_, index) => (
                <li key={index}>
                  <Link to="/">Link {index + 1}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
