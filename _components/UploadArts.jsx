import { headers } from "@/next.config";
import { Public, RotateRight, UploadFile } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function UploadArts() {
  const [images, setImages] = useState([]);
  const [dataImage, setDataImage] = useState([]);
  const [AIEngine, setAIEngine] = useState("");
  const [otherSection, setOtherSection] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const selectedFiles = (e) => {
    const file = e.target.files;

    for (var i = 0; i < file.length; i++) {
      //console.log(file[i]);

      const filter = ["image/jpeg", "image/jpg", "image/png"];
      if (!filter.includes(file[i].type)) {
        return Toastify({
          text: "Oopss! only accept image format",
          duration: 3000,
          close: true,
          position: "center",
          stopOnFocus: true,
          className: "ibnerror",
          style: {
            background:
              "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
          },
        }).showToast();
      }
    }

    const cv = Array.from(e.target.files);

    setDataImage(cv);
    setImages(
      cv.map((item) => {
        return { name: item.name };
      })
    );
  };

  const uploadNow = async () => {
    const data = new FormData();

    if (dataImage.length <= 0)
      return Toastify({
        text: "Choose at least 1 image",
        duration: 3000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibnerror",
        style: {
          background:
            "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
        },
      }).showToast();

    if (AIEngine === "")
      return Toastify({
        text: "Please select AI Engine",
        duration: 2000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibnerror",
        style: {
          background:
            "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
        },
      }).showToast();

    setUploadProgress(true);

    dataImage.forEach((item) => {
      data.append("images", item);
    });
    data.append("engine", AIEngine);

    await axios
      .post("/api/upload/art/", data)
      .then((response) => {
        console.log(response.data.error);

        if (response.data.error === 0)
          return Toastify({
            text: "AI Art Uploaded Successfully!",
            duration: 2000,
            close: true,
            position: "center",
            stopOnFocus: true,
            escapeMarkup: true,
            className: "ibn-success",
            style: {
              background:
                "linear-gradient( 109.6deg,  rgba(24,138,141,1) 11.2%, rgba(96,221,142,1) 91.1% )",
            },
            callback: function () {
              setImages([]);
              setOtherSection(false);
              setAIEngine("");
              setDataImage([]);
              setUploadProgress(false);
            },
          }).showToast();
      })
      .catch((error) => {
        console.log(error.response.data);

        return Toastify({
          text: error.response.data.message,
          duration: 2000,
          close: true,
          position: "center",
          stopOnFocus: true,
          escapeMarkup: true,
          className: "ibn-error",
          style: {
            background:
              "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
          },
          callback: function () {
            setImages([]);
            setOtherSection(false);
            setAIEngine("");
            setDataImage([]);
            setUploadProgress(false);
          },
        }).showToast();
      });
  };

  const aiEngine = (e) => {
    let engine = e.target.value;

    if (engine === "Others") {
      setOtherSection(true);
    } else if (engine === "") {
      setAIEngine("");
      return Toastify({
        text: "Please select AI Engine",
        duration: 3000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibnerror",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
        },
      }).showToast();
    } else {
      setOtherSection(false);
      setAIEngine(engine);
    }
  };

  useEffect(() => {
    console.log(dataImage);
  }, [dataImage]);

  useEffect(() => {
    console.log(AIEngine);
  }, [AIEngine]);

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
              onChange={(e) => aiEngine(e)}
              className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
            >
              <option value="">Select AI Engine...</option>
              <option value="Midjourney">Midjourney</option>
              <option value="Stablediffusion">Stablediffusion</option>
              <option value="Bing AI">Bing AI</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* VISIBLE IF OTHERS ENGINE SELECTED */}

          {otherSection && (
            <div className="w-full h-auto mb-5">
              <input
                onChange={(e) => setAIEngine(e.target.value)}
                type="text"
                placeholder="What ai engine do you use?"
                className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
              />
            </div>
          )}

          {/* <div className="w-full h-auto mb-5">
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
          </div> */}

          <div className="w-full h-auto mb-5 font-bold text-thirdColor">
            Upload Image
          </div>

          <div className="w-auto h-auto p-3 rounded-lg bg-mainColor shadow-inner mb-5">
            {images.map((item) => {
              return (
                <>
                  <p className="italic">
                    {item.name} <strong>selected</strong>
                  </p>
                </>
              );
            })}
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
                onChange={(e) => selectedFiles(e)}
                type="file"
                multiple="multiple"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="w-full h-auto">
            {uploadProgress ? (
              <div className="text-center">
                <RotateRight className="animate-spin" />
                Upload Progress...
              </div>
            ) : (
              <button
                onClick={() => uploadNow()}
                className="p-3 mb-5 border border-acsentColor rounded-lg float-end text-sm hover:bg-acsentColor hover:text-mainColor hover:font-bold"
              >
                <Public /> Publish Now!
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadArts;
