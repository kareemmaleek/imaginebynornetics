import { Download, Visibility, ZoomIn } from "@mui/icons-material";
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
      <div className="w-full h-screen overflow-y-scroll p-5">
        <div className="columns-5 gap-2 space-y-2 w-full h-auto">
          {gallery.map((item, x) => {
            return (
              <Link href={`/details/${item.id}`}>
                <div
                  key={x}
                  className="group w-auto h-auto relative shadow-lg cursor-zoom-in hover:scale-95 duration-300"
                >
                  <Image
                    src={`${item.img_path}`}
                    className="h-auto max-w-full rounded-lg"
                    alt=""
                    width={350}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div className="hidden bg-secondaryColor w-full h-full absolute top-0 left-0 group-hover:flex justify-center items-center rounded-lg opacity-70">
                    <div className="flex-col">
                      <div className="text-xl text-center mb-3 font-bold">
                        <ZoomIn className="text-2xl" />
                        Details
                      </div>
                      <div className="text-sm text-center">
                        <span className="mr-3">
                          <Visibility className="text-sm" /> {item.img_views}
                        </span>
                        <Download className="text-sm" /> {item.img_download}
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
