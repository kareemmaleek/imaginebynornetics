import { headers } from "@/next.config";
import { IconRotateClockwise, IconWorld, IconX } from "@tabler/icons-react";
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
  const [aspectRatio, setAspectRatio] = useState("");

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
        return { name: item.name, file: item };
      }),
    );

    if (cv.length > 0) {
      const file = cv[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          const floatRatio = w / h;

          const standardRatios = [
            { label: "16:9", value: 16 / 9 },
            { label: "4:3", value: 4 / 3 },
            { label: "3:2", value: 3 / 2 },
            { label: "1:1", value: 1 / 1 },
            { label: "2:3", value: 2 / 3 },
            { label: "9:16", value: 9 / 16 },
            { label: "21:9", value: 21 / 9 },
          ];

          let closest = standardRatios[0];
          let minDiff = Math.abs(floatRatio - closest.value);

          standardRatios.forEach((sr) => {
            const diff = Math.abs(floatRatio - sr.value);
            if (diff < minDiff) {
              minDiff = diff;
              closest = sr;
            }
          });

          // If the difference is small enough (tolerance 0.1), snap to standard
          if (minDiff < 0.1) {
            setAspectRatio(closest.label);
          } else {
            const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
            const common = gcd(w, h);
            setAspectRatio(`${w / common}:${h / common}`);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
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

    if (aspectRatio === "")
      return Toastify({
        text: "Please select Aspect Ratio",
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
    data.append("aspect_ratio", aspectRatio);

    const token = localStorage.getItem("ibn_token");

    await axios
      .post("/api/upload/art/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setDataImage(dataImage.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log(dataImage);
  }, [dataImage]);

  useEffect(() => {
    console.log(AIEngine);
  }, [AIEngine]);

  return (
    <>
      <div className="w-full h-screen p-3 md:p-10 overflow-y-auto">
        <div className="w-full md:w-8/12 lg:w-6/12 h-auto p-5 bg-secondaryColor rounded-lg shadow-lg">
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
              <option disabled selected>
                Select AI Engine...
              </option>
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

          <div className="w-full h-auto mb-5">
            <label htmlFor="engine" className="font-bold text-thirdColor">
              Aspect Ratio
              <p className="text-xs text-thirdColor font-normal italic">
                (auto detected from image)
              </p>
            </label>
            <select
              id="aspect"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent "
              disabled
            >
              <option disabled selected>
                Select Aspect Ratio...
              </option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="2:3">2:3 (Portrait)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="9:16">9:16 (Story)</option>
              {aspectRatio &&
                !["16:9", "2:3", "1:1", "9:16"].includes(aspectRatio) && (
                  <option value={aspectRatio}>{aspectRatio} (Detected)</option>
                )}
            </select>
          </div>

          <div className="w-full h-auto mb-5 font-bold text-thirdColor">
            Upload Image
          </div>

          {images.length > 0 && (
            <div className="w-auto h-auto p-3 rounded-lg bg-mainColor shadow-inner mb-5 flex flex-col items-center justify-center">
              <p className="italic text-xs mb-2">
                {" "}
                Here's the preview of your uploaded image
              </p>
              {images.map((item, index) => {
                return (
                  <>
                    <div className="w-fit h-fit relative transition duration-500 hover:scale-95 cursor-pointer hover:shadow-[0_0_20px_-10px_rgba(137,190,172,0.5)] hover:shadow-lg">
                      <img
                        src={URL.createObjectURL(item.file)}
                        alt=""
                        className="w-[150px] rounded-md"
                      />
                      <div
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-4 h-4 rounded-full border border-acsentColor flex justify-center items-center cursor-pointer hover:bg-[var(--acsentColor)] hover:text-mainColor"
                      >
                        <IconX size={12} />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}

          {images.length <= 0 && (
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
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
          )}

          <div className="w-full h-auto">
            {uploadProgress ? (
              <div className="text-center">
                <IconRotateClockwise className="animate-spin inline-block mr-2" />
                Upload Progress...
              </div>
            ) : (
              <button
                onClick={() => uploadNow()}
                className="p-3 mb-5 border border-acsentColor rounded-lg float-end flex justify-center items-center text-sm font-semibold hover:bg-acsentBtn"
              >
                <IconWorld className="inline-block mr-2" size={16} /> Publish
                Now!
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadArts;
