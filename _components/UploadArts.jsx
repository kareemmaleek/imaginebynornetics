import { headers } from "@/next.config";
import {
  IconRotateClockwise,
  IconWorld,
  IconX,
  IconCaretDownFilled,
  IconChevronDown,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
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
  const [engineOpen, setEngineOpen] = useState(false);
  const engineRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (engineRef.current && !engineRef.current.contains(event.target)) {
        setEngineOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const engines = [
    { label: "Midjourney", value: "Midjourney" },
    { label: "Gemini", value: "Gemini" },
    { label: "Leonardo AI", value: "LeonardoAI" },
    { label: "Stable Diffusion", value: "StableDiffusion" },
    { label: "DALL·E", value: "DALLE" },
    { label: "Adobe Firefly", value: "Firefly" },
    { label: "Ideogram", value: "Ideogram" },
    { label: "Runway", value: "Runway" },
    { label: "Pika", value: "Pika" },
    { label: "Bing Image Creator", value: "BingImageCreator" },
    { label: "Others", value: "Others" },
  ];

  const selectedFiles = (e) => {
    const file = e.target.files;

    if (file.length > 10) {
      return Toastify({
        text: "Oopss! Maximum 10 images are allowed",
        duration: 3000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibn-error",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
        },
      }).showToast();
    }

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
          className: "ibn-error",
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

    try {
      await axios
        .post("/api/upload/art", data, {
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
          // console.log(error.response.data);

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
    } catch (err) {
      // console.log(err);
      return Toastify({
        text: err.message,
        duration: 2000,
        close: true,
        position: "center",
        stopOnFocus: true,
        escapeMarkup: true,
        className: "ibn-error",
        callback: function () {
          setImages([]);
          setDataImage([]);
          setUploadProgress(false);
        },
      }).showToast();
    }
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
      <div className="w-full h-auto p-3 md:p-10">
        <div className="w-full md:w-10/12 xl:w-6/12 mx-auto h-auto p-5 md:p-8 bg-secondaryColor rounded-xl shadow-2xl border border-acsentColor/10">
          <div className="mb-10">
            <h1 className="font-bold text-xl">Upload Arts</h1>
            <p className="italic text-sm text-thirdColor">
              share your ai creations with the world!
            </p>
            <p className="mt-2 w-full rounded-md bg-acsentColor/10 border border-acsentColor/20 text-xs px-2 py-1">
              Before your ai art fully published we will review your ai art
              first, you can check your ai art status in{" "}
              <Link
                href="/my-collections"
                className="font-semibold text-acsentColor hover:text-acsentColor/80"
              >
                My Collections
              </Link>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="w-full h-auto relative" ref={engineRef}>
              <label className="font-semibold text-xs uppercase tracking-widest text-thirdColor mb-3 block">
                AI Engine
              </label>

              <div
                onClick={() => setEngineOpen(!engineOpen)}
                className={`
                  w-full p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border
                  ${AIEngine ? "bg-gradient-to-br from-acsentColor to-[#3387ae] text-white border-transparent font-bold shadow-lg" : "bg-mainColor/50 text-thirdColor border-acsentColor/10 hover:border-acsentColor/30"}
                `}
              >
                <span className="text-sm">
                  {engines.find((e) => e.value === AIEngine)?.label ||
                    "Select Engine..."}
                </span>
                <IconCaretDownFilled
                  size={16}
                  className={`transition-transform duration-300 ${engineOpen ? "rotate-180" : ""}`}
                />
              </div>

              {engineOpen && (
                <div
                  data-lenis-prevent
                  className="absolute top-full left-0 w-full max-h-60 overflow-y-auto p-2 bg-secondaryColor border border-acsentColor/20 rounded-xl shadow-2xl z-[50] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {engines.map((item) => (
                    <div
                      key={item.value}
                      onClick={() => {
                        if (item.value === "Others") setOtherSection(true);
                        else {
                          setOtherSection(false);
                          setAIEngine(item.value);
                        }
                        setEngineOpen(false);
                      }}
                      className={`
                        px-4 py-3 text-sm cursor-pointer transition-colors rounded-md
                        ${AIEngine === item.value ? "bg-acsentColor/20 text-acsentColor font-bold" : "text-thirdColor hover:bg-mainColor hover:text-acsentColor"}
                      `}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full h-auto">
              <label
                htmlFor="aspect"
                className="font-semibold text-xs uppercase tracking-widest text-thirdColor mb-3 block"
              >
                Aspect Ratio
                <span className="ml-2 lowercase font-normal italic opacity-60">
                  (auto detect)
                </span>
              </label>
              <div className="w-full p-3 rounded-lg bg-mainColor/30 text-thirdColor border border-acsentColor/10 text-sm flex items-center justify-between opacity-80 cursor-not-allowed">
                <span>
                  {aspectRatio
                    ? `${aspectRatio} (${aspectRatio === "1:1" ? "Square" : Number(aspectRatio.split(":")[0]) > Number(aspectRatio.split(":")[1]) ? "Landscape" : "Portrait"})`
                    : "Waiting for image..."}
                </span>
                <IconRotateClockwise
                  size={16}
                  className={!aspectRatio ? "animate-spin" : ""}
                />
              </div>
            </div>
          </div>

          {/* VISIBLE IF OTHERS ENGINE SELECTED */}
          {otherSection && (
            <div className="w-full h-auto mb-8 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="font-semibold text-xs uppercase tracking-widest text-thirdColor mb-2 block">
                Custom Engine Name
              </label>
              <input
                onChange={(e) => setAIEngine(e.target.value)}
                type="text"
                placeholder="Which AI engine did you use?"
                className="p-3 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner outline-none border border-acsentColor/10 focus:border-acsentColor transition-colors"
              />
            </div>
          )}

          <div className="w-full h-auto mb-8">
            <label className="font-semibold text-xs uppercase tracking-widest text-thirdColor mb-3 block">
              Image Selection
            </label>

            {images.length > 0 ? (
              <div className="w-full p-4 rounded-xl bg-mainColor/30 border border-dashed border-acsentColor/20 mb-5">
                <p className="italic text-[10px] text-thirdColor/60 mb-4 text-center uppercase tracking-widest">
                  Preview Selection
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {images.map((item, index) => (
                    <div
                      key={index}
                      className="group relative w-32 h-32 rounded-lg overflow-hidden border border-acsentColor/20 shadow-xl"
                    >
                      <img
                        src={URL.createObjectURL(item.file)}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                          <IconX size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setImages([]);
                    setDataImage([]);
                  }}
                  className="w-full mt-4 text-[10px] uppercase font-bold text-red-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-acsentColor/10 border-dashed rounded-xl cursor-pointer bg-mainColor/30 hover:bg-mainColor/50 hover:border-acsentColor/30 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 rounded-full bg-acsentColor/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-acsentColor"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm text-acsentColor font-semibold">
                      Click to upload arts
                    </p>
                    <p className="text-xs text-thirdColor">
                      PNG, JPG, or WEBP (Max 10 images)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    onChange={(e) => selectedFiles(e)}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="w-full flex justify-end items-center pt-4 border-t border-acsentColor/10">
            {uploadProgress ? (
              <div className="flex items-center gap-3 text-acsentColor font-semibold italic text-sm">
                <IconRotateClockwise className="animate-spin" size={20} />
                Uploading your art...
              </div>
            ) : (
              <button
                onClick={() => uploadNow()}
                className="group px-6 py-3 bg-acsentColor/10 border border-acsentColor/20 text-thirdColor hover:bg-acsentBtn hover:text-acsentColor rounded-xl flex items-center gap-2 text-xs font-semibold transition-all active:scale-95 shadow-lg"
              >
                <IconWorld
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
                Publish Now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadArts;
