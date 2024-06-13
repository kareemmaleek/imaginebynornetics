import React from "react";
import NavBar from "../navbar";

function Home({ children }) {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[250px] h-auto bg-secondaryColor relative">
        <NavBar />
      </div>
      <div className="w-full h-full">
        <main>{children}</main>
      </div>

      <div className="absolute bottom-10 right-10 italic text-xs p-3 rounded-lg bg-black/30 backdrop-blur-md">
        <p className="">imaginebynornetics app version v1.0</p>
      </div>
    </div>
  );
}

export default Home;
