import { Download, Visibility, ZoomIn } from "@mui/icons-material";
import Link from "next/link";
import React, { useEffect } from "react";

function Gallery() {
  return (
    <>
      <div className="w-full h-screen overflow-y-scroll p-5">
        <div className="columns-5 gap-2 space-y-2 w-full h-auto">
          {[...Array(50)].map((i, x) => {
            return (
              <Link href={`/details`}>
                <div
                  key={x}
                  className="group w-auto h-auto relative shadow-lg cursor-zoom-in hover:scale-95 duration-300"
                >
                  <img
                    src={`/assets/images/ai/${x + 1}.png`}
                    className="h-auto max-w-full rounded-lg"
                  />
                  <div className="hidden bg-secondaryColor w-full h-full absolute top-0 left-0 group-hover:flex justify-center items-center rounded-lg opacity-70">
                    <div className="flex-col">
                      <div className="text-xl text-center mb-3 font-bold">
                        <ZoomIn className="text-2xl" />
                        Details
                      </div>
                      <div className="text-sm text-center">
                        <span className="mr-3">
                          <Visibility className="text-sm" /> 200
                        </span>
                        <Download className="text-sm" /> 200
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
