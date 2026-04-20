import {
  IconArrowLeft,
  IconDownload,
  IconEye,
  IconHeart,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import xbytes from "xbytes";

function DetailsImage({ img_id }) {
  const [dataImage, setDataImage] = useState([]);

  const getImage = async (id) => {
    await axios
      .get(`/api/gallery/getImage?uid=${id}`)
      .then((response) => {
        setDataImage(response.data.data);
        console.log(response.data.data);
      })
      .catch((err) => {
        return Toastify({
          text: err.response.data.message,
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
        }).showToast();
      });
  };

  const upViews = async (id) => {
    await axios
      .post("/api/gallery/upViews", { id: id })
      .then((response) => {
        if (response.data.error === 0) {
          null;
        } else {
          null;
        }
      })
      .catch((err) => {
        return Toastify({
          text: err.response.data.message,
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
        }).showToast();
      });
  };

  useEffect(() => {
    if (img_id !== "") {
      getImage(img_id);
      upViews(img_id);
    }
    //console.log(img_id);
  }, [img_id]);

  const downloadImage = async (image, id) => {
    await axios
      .post("/api/gallery/upDownloads", { id: id })
      .then((response) => {
        if (response.data.error === 0) {
          return Toastify({
            text: "Download image in progress!",
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
          }).showToast();
        } else {
          return Toastify({
            text: response.data.message,
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
          }).showToast();
        }
      })
      .catch((err) => {
        return Toastify({
          text: err.response.data.message,
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
        }).showToast();
      });

    const a = document.createElement("a");
    a.href = image;
    a.download = image.split("uploads/")[1];
    a.click();
  };

  return (
    <>
      {dataImage.map((item, x) => {
        const fileSize = xbytes(item.file_size);

        return (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${item.img_path}')` }}
          >
            <div className="w-full h-full p-4 lg:p-5 pt-8 lg:pt-10 flex flex-col lg:flex-row justify-between gap-5 backdrop-brightness-[25%] backdrop-blur-xl overflow-y-auto lg:overflow-hidden">
              <div className="w-full lg:w-fit h-fit ">
                <Link href={`/`}>
                  <span className="w-10 h-10 bg-secondaryColor hover:bg-acsentBtn hover:text-acsentColor cursor-pointer rounded-full flex justify-center items-center shadow-lg">
                    <IconArrowLeft size={20} />
                  </span>
                </Link>
              </div>

              <div className="w-full h-fit lg:h-full flex justify-center items-center">
                <div className="w-full md:w-fit h-fit lg:h-full relative flex justify-center">
                  <img
                    src={item.img_path}
                    className="w-full h-auto lg:h-full lg:w-auto rounded-lg shadow-2xl"
                  />

                  <div className="absolute top-3 right-3 p-1 px-2 rounded-full bg-secondaryColor/80 backdrop-blur-md flex items-center gap-1 text-sm hover:bg-acsentBtn cursor-pointer transition-all border border-white/10">
                    <span>12</span>
                    <IconHeart size={16} />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px] h-auto flex flex-col">
                <div className="w-full h-auto p-5 bg-secondaryColor rounded-lg mb-5 border border-white/5">
                  <div className="w-full h-auto flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-lime-300 shadow-inner"></div>
                    <div className="w-fit flex flex-col">
                      <h1 className="font-semibold hover:underline cursor-pointer">
                        {item.created_by}
                      </h1>
                      <p className="text-xs italic text-thirdColor">
                        {moment(item.created_at).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex gap-1 items-center mb-5">
                    <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
                      <div className="w-full h-auto flex items-center gap-1">
                        <IconEye size={14} />
                        <span className="text-xs font-semibold">
                          {item.img_views || 0}
                        </span>
                      </div>
                    </div>
                    <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
                      <div className="w-full h-auto flex items-center gap-1">
                        <IconDownload size={14} />
                        <span className="text-xs font-semibold">
                          {item.img_downloads || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-auto mb-5">
                    <h1 className="font-semibold text-sm my-1">Details</h1>
                    <div className="w-full flex flex-wrap gap-1 ">
                      <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                        <span className="text-thirdColor">AI Engine:</span>
                        {item.img_engine}
                      </div>
                      <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                        <span className="text-thirdColor">Ratio:</span>
                        {item.img_ratio}
                      </div>
                      <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                        <span className="text-thirdColor">Size:</span>
                        {fileSize}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-auto">
                    <div className="my-3">
                      <h1 className="font-semibold text-sm">Save to Device</h1>
                      <p className="text-xs italic text-thirdColor leading-relaxed">
                        you can save to device for wallpaper or other needs
                      </p>
                    </div>
                    <button
                      onClick={() => downloadImage(item.img_path, item.id)}
                      id="download"
                      className="w-full lg:w-fit h-auto p-2 text-xs rounded-lg font-semibold border border-acsentColor text-acsentColor hover:bg-acsentBtn hover:text-acsentColor transition-all shadow-lg active:scale-95"
                    >
                      <IconDownload
                        className="animate-bounce inline-block mr-2"
                        size={16}
                      />{" "}
                      Download Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          // <div
          //   key={x}
          //   className={`w-full h-screen bg-cover bg-center bg-no-repeat`}
          //   style={{ backgroundImage: `url('${item.img_path}')` }}
          // >
          //   <div className="w-full h-screen flex flex-col md:flex-row p-3 md:p-5 backdrop-brightness-[25%] backdrop-blur-xl overflow-y-auto md:overflow-hidden">
          //     <div className="w-full md:w-9/12 h-auto md:h-full flex items-center justify-center relative rounded-lg mb-3 md:mb-0">
          //       <div className="w-full h-full flex items-center justify-center relative p-2">
          //         <div className="w-[90%] h-auto relative bg-yellow-200">
          //           <img
          //             src={item.img_path}
          //             className="rounded-lg w-fit h-auto"
          //           />
          //           <div className="absolute top-5 right-5 p-1 px-2 rounded-full bg-secondaryColor/80 backdrop-blur-md flex items-center gap-1 text-sm hover:bg-acsentBtn cursor-pointer transition-all border border-white/10">
          //             <span>12</span>
          //             <IconHeart size={16} />
          //           </div>
          //         </div>
          //       </div>

          //       <Link href={`/`}>
          //         <span className="absolute left-2 top-2 w-10 h-10 bg-secondaryColor hover:bg-acsentBtn hover:text-acsentColor cursor-pointer rounded-full flex justify-center items-center">
          //           <IconArrowLeft size={20} />
          //         </span>
          //       </Link>
          //     </div>

          //     <div className="w-full md:w-3/12 h-auto md:h-full flex flex-col">
          //       <div className="w-full h-auto p-5 bg-secondaryColor rounded-lg mb-5">
          //         <div className="w-full h-auto flex items-center gap-2 mb-3">
          //           <div className="w-10 h-10 rounded-full bg-lime-300"></div>
          //           <div className="w-fit flex flex-col">
          //             <h1 className="font-semibold hover:underline cursor-pointer">
          //               {item.created_by}
          //             </h1>
          //             <p className="text-xs italic text-thirdColor">
          //               {moment(item.created_at).fromNow()}
          //             </p>
          //           </div>
          //         </div>

          //         <div className="w-full flex gap-1 items-center mb-5">
          //           <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
          //             <div className="w-full h-auto flex items-center gap-1">
          //               <IconEye size={14} />
          //               <span className="text-xs font-semibold">
          //                 {item.img_views || 0}
          //               </span>
          //             </div>
          //           </div>
          //           <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
          //             <div className="w-full h-auto flex items-center gap-1">
          //               <IconDownload size={14} />
          //               <span className="text-xs font-semibold">
          //                 {item.img_downloads || 0}
          //               </span>
          //             </div>
          //           </div>
          //         </div>

          //         <div className="w-full h-auto mb-5">
          //           <h1 className="font-semibold text-sm my-1">Details</h1>
          //           <div className="w-full flex flex-wrap gap-1 ">
          //             <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor">
          //               {item.img_engine}
          //             </div>
          //             <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor">
          //               {item.img_ratio}
          //             </div>
          //             <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor">
          //               {fileSize}
          //             </div>
          //           </div>
          //         </div>

          //         <div className="w-full h-auto">
          //           <div className="my-3">
          //             <h1 className="font-semibold text-sm">Save to Device</h1>
          //             <p className="text-xs italic text-thirdColor">
          //               you can save to device for wallpaper or other needs
          //             </p>
          //           </div>
          //           <button
          //             onClick={() => downloadImage(item.img_path, item.id)}
          //             id="download"
          //             className="w-fit h-auto p-2 text-xs rounded-lg font-semibold ring-1 ring-acsentColor hover:bg-acsentBtn hover:text-acsentColor duration-100"
          //           >
          //             <IconDownload
          //               className="animate-bounce inline-block mr-2"
          //               size={16}
          //             />{" "}
          //             Download Image
          //           </button>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        );
      })}
    </>
  );
}

export default DetailsImage;
