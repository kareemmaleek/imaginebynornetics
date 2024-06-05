import React from "react";

function gallery() {
  return (
    <div className="w-full h-auto p-5 grid grid-cols-5 gap-2">
      <div className="w-full h-auto grid grid-cols-1 gap-2">
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-72 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 gap-2">
        <div className="w-full h-72 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 gap-2">
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-72 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 gap-2">
        <div className="w-full h-72 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 gap-2">
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-72 bg-secondaryColor rounded-md"></div>
        <div className="w-full h-32 bg-secondaryColor rounded-md"></div>
      </div>
    </div>
  );
}

export default gallery;
