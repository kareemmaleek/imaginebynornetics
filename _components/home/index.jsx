import React from "react";
import NavBar from "../navbar";
import Gallery from "../Gallery";

function Home() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[250px] h-auto bg-secondaryColor relative">
        <NavBar />
      </div>
      <div className="w-full h-full">
        <Gallery />
      </div>
    </div>
  );
}

export default Home;
