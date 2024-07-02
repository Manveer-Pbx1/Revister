import React, { useState } from "react";

export default function Header() {
  return (
    <div>
      <h1 className="p-[65px] italic font-bold text-5xl">
        REVISTER
        <span className="text-xl font-semibold text-green-400 ">- your one stop for revisiting all those problems!</span>
      </h1>
      <button className="absolute float-right bottom-[75px] right-4 text-xl text-blue-400 font-semibold ">
        Set up Notifications
      </button>
    </div>
  );
}
