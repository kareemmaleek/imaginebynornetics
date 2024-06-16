import React, { useEffect } from "react";

function Loading() {
  useEffect(() => {
    console.log("loading muncul!");
  }, []);
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <img
          src="./assets/images/logo_nornetics.png"
          alt="imaginebynornetics"
        />
      </div>
    </>
  );
}

export default Loading;
