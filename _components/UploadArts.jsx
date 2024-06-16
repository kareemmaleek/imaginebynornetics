import { Public, UploadFile } from "@mui/icons-material";
import React from "react";

function UploadArts() {
  return (
    <>
      <div className="w-full h-screen p-10">
        <div className="w-6/12 h-full p-5 bg-secondaryColor rounded-lg shadow-lg">
          <div className="mb-10 h-auto">
            <h1 className="font-bold text-xl">Upload Arts</h1>
            <p className="italic text-sm text-thirdColor">
              show your ai arts to the worlds!
            </p>
          </div>

          <div className="w-full h-auto mb-5">
            <label htmlFor="engine" className="font-bold text-thirdColor">
              Engine
            </label>
            <select
              id="engine"
              className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
            >
              <option value="">Select AI Engine...</option>
              <option value="">Midjourney</option>
              <option value="">Stablediffusion</option>
              <option value="">Bing AI</option>
              <option value="">Others</option>
            </select>
          </div>

          {/* VISIBLE IF OTHERS ENGINE SELECTED */}
          <div className="w-full h-auto mb-5">
            <input
              type="text"
              placeholder="What ai engine do you use?"
              className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
            />
          </div>

          <div className="w-full h-auto mb-5">
            <label htmlFor="engine" className="font-bold text-thirdColor">
              Aspect Ratio
            </label>
            <select
              id="engine"
              className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
            >
              <option value="">Select Aspect Ratio...</option>
              <option value="">16:9</option>
              <option value="">5:3</option>
              <option value="">21:9</option>
            </select>
          </div>

          <div className="w-full h-auto mb-5 font-bold text-thirdColor">
            Upload Image
          </div>

          <div className="w-auto h-auto p-3 rounded-lg bg-mainColor shadow-inner mb-5">
            <p className="italic">
              IBN022939.jpg <strong>selected</strong>
            </p>
          </div>

          <div className="flex items-center justify-center w-full mb-5">
            <label
              for="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-acsentColor border-dashed rounded-lg cursor-pointer bg-mainColor  hover:bg-mainColor/50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="w-full h-auto">
            <button className="p-3 mb-5 border border-acsentColor rounded-lg float-end text-sm hover:bg-acsentColor hover:text-mainColor hover:font-bold">
              <Public /> Publish Now!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadArts;
