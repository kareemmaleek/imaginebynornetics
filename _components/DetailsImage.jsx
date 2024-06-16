import {
  ArrowBack,
  ArrowLeft,
  Close,
  Download,
  Visibility,
} from "@mui/icons-material";
import Link from "next/link";
import React from "react";

function DetailsImage() {
  return (
    <>
      <div className="w-full h-screen flex p-5">
        <div className="w-8/12 h-full flex justify-center relative rounded-lg">
          <img src="./assets/images/ai/1.png" className="rounded-lg" />
          <Link href={`/`}>
            <span className="absolute left-2 top-2 w-10 h-10 bg-secondaryColor hover:bg-acsentColor hover:text-mainColor cursor-pointer rounded-full flex justify-center items-center">
              <ArrowBack />
            </span>
          </Link>
        </div>

        <div className="w-4/12 h-full flex flex-col">
          <div className="w-full h-auto p-5 bg-secondaryColor rounded-lg mb-5">
            <h1 className="font-bold">Image Details</h1>
            <p className="text-xs italic mb-5 text-thirdColor">
              more details for this ai creation
            </p>
            <div className="bg-mainColor rounded-lg p-5">
              <table className="w-full text-left border border-acsentColor rounded-xl text-sm">
                <tbody className="rounded-lg">
                  <tr className="border border-acsentColor">
                    <th className="p-2 border border-acsentColor">File Name</th>
                    <td className="border border-acsentColor p-2 ">
                      imaginebynornetics-IBN001.png
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">File Size</th>
                    <td className="border border-acsentColor p-2">12.5 Mib</td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">
                      Aspect Ratio
                    </th>
                    <td className="border border-acsentColor p-2">9:16</td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">Engine</th>
                    <td className="border border-acsentColor p-2">
                      Midjourney
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">
                      Created By
                    </th>
                    <td className="border border-acsentColor p-2">Nornetics</td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">
                      Created Date
                    </th>
                    <td className="border border-acsentColor p-2">
                      Sun, 17 Mei 2024
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">Views</th>
                    <td className="border border-acsentColor p-2">
                      1254 <Visibility className="text-sm" />
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 border border-acsentColor">Downloads</th>
                    <td className="border border-acsentColor p-2">
                      64 <Download className="text-sm" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full h-auto bg-secondaryColor p-5 rounded-lg">
            <h1 className="font-bold">Save to Device</h1>
            <p className="text-xs italic mb-5 text-thirdColor">
              you can save to device for wallpaper or other needs
            </p>
            <button className="w-full h-auto p-2 rounded-lg font-bold ring-1 ring-acsentColor hover:bg-acsentBtn hover:text-acsentColor duration-100">
              <Download className="animate-bounce" /> Download Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsImage;
