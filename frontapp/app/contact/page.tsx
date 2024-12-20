"use client";

import React from "react";

function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Contact us</h1>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">LONDON</h2>
        <p className="text-gray-700">newbusiness@weareimpero.com</p>
        <p className="text-gray-700">+44 20 7998 7571</p>
        <p className="text-gray-700">Unit 306, Metropolitan Wharf,</p>
        <p className="text-gray-700">70 Wapping Wall, London E1W 3SS</p>
        <a href="#" className="text-blue-600 hover:underline mt-2 block">SEE ON MAP →</a>

        <h2 className="text-2xl font-semibold mt-8 mb-4">BUENOS AIRES</h2>
        <p className="text-gray-700">buenosaires@weareimpero.com</p>
        <p className="text-gray-700">+54 11 6799 7949</p>
        <p className="text-gray-700">Cabildo 1458 1st floor,</p>
        <p className="text-gray-700">Buenos Aires</p>
        <a href="#" className="text-blue-600 hover:underline mt-2 block">SEE ON MAP →</a>

        <h2 className="text-2xl font-semibold mt-8 mb-4">WANT TO BE THE SMARTEST IN YOUR OFFICE?</h2>
        <a href="#" className="text-blue-600 hover:underline">SIGN UP FOR OUR NEWSLETTER →</a>

        <h2 className="text-2xl font-semibold mt-8 mb-4">FOLLOW US</h2>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-600 hover:underline">Behance</a>
          <a href="#" className="text-blue-600 hover:underline">Dribbble</a>
          <a href="#" className="text-blue-600 hover:underline">Instagram</a>
          <a href="#" className="text-blue-600 hover:underline">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 