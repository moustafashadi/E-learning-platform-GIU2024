"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-2 fixed bottom-0 w-full flex justify-center rounded-t-lg">
      <div className="w-full">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-1 text-center">Contact us</h1>
          <div className="w-full text-left">
            <h2 className="ml-2 text-xl font-semibold mb-1">EGYPT</h2>
            <div className="ml-2 flex flex-wrap">
              <p className="mr-5">abdallah1038@hotmail.com</p>
              <p className="mr-5">01008400576</p>
            </div>
            <div className="ml-2 flex flex-wrap mt-1">
              <p className="mr-5">omarwaleedalazhary@gmail.com</p>
              <p>01145400986</p>
            </div>
            <h2 className="ml-2 text-xl font-semibold mt-2 mb-1">FOLLOW US</h2>
            <div className="ml-2 flex space-x-4">
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Behance</a>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Dribbble</a>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Instagram</a>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;