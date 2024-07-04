import React, { useState } from "react";
import { CiBellOn } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <h1 className="p-[65px] italic font-bold text-5xl">
        REVISTER
        <span className="text-xl font-semibold text-green-600 ">- Be Consistent. Be Disciplined. </span>
      </h1>
      <Link to='/notifications'>
      <button className="absolute float-right bottom-[75px] right-4 text-xl text-blue-400 font-semibold ">
        <CiBellOn className="inline-block text-4xl text-black"/>Remind Me!
      </button>
      </Link>
    </div>
  );
}
