import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-8">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Contact us</h1>

        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">EGYPT</h2>
          <p>abdullah1038@hotmail.com</p>
          <p>01008400576</p>


          <p>omarwaleedalazhary@gmail.com</p>
          <p>01145400986</p>




          

          <h2 className="text-2xl font-semibold mt-8 mb-4">FOLLOW US</h2>
          <div className="flex space-x-4">
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Behance</a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Dribbble</a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">Instagram</a>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-blue-400 hover:underline">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 