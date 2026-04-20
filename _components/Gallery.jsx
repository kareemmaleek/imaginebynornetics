import { IconDownload, IconEye, IconZoomIn } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Image from "next/image";

function Gallery() {
  const [gallery, setGallery] = useState([]);

  const getImages = async () => {
    await axios
      .get("/api/gallery/getAll")
      .then((response) => {
        if (response.data.error === 0) {
          setGallery(response.data.data);
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
    getImages();
  }, []);

  return (
    <>
      <div className="w-full h-screen overflow-y-scroll p-3 md:p-5">
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-0 space-y-2 w-full h-auto">
          {gallery.map((item, x) => {
            return (
              <Link href={`/details/${item.uid}`}>
                <div
                  key={x}
                  className="group w-auto h-auto relative shadow-lg cursor-zoom-in hover:scale-95 duration-300"
                >
                  <Image
                    src={`${item.img_path}`}
                    className="h-auto max-w-full"
                    alt=""
                    width={350}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div className="hidden bg-secondaryColor/60 w-full h-full absolute top-0 left-0 group-hover:flex justify-center items-center">
                    <div className="flex-col">
                      {/* <div className="text-sm text-center mb-3 font-bold p-2 px-3 rounded-full bg-mainColor ">
                        Details
                      </div> */}
                      <div className="text-sm text-center mb-3">
                        <span className="mr-3">
                          <IconEye className="inline-block mr-1" size={14} />
                          {item.img_views}
                        </span>
                        <IconDownload className="inline-block mr-1" size={14} />
                        {item.img_download}
                      </div>
                      <div className="text-xs text-center p-2 px-3 bg-mainColor text-acsentColor rounded-full ">
                        by {""}
                        <span className="font-bold underline cursor-pointer">
                          {item.created_by}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Gallery;
