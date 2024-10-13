import {
  ArrowBack,
  ArrowLeft,
  Close,
  Download,
  Visibility,
} from "@mui/icons-material";
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
      .get(`/api/gallery/getImage?id=${id}`)
      .then((response) => {
        setDataImage(response.data.data);
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
        const date = moment(item.created_date).format("DD-MM-YYYY h:mm A");
        return (
          <div key={x} className="w-full h-screen flex p-5">
            <div className="w-8/12 h-full flex justify-center relative rounded-lg">
              <img src={item.img_path} className="rounded-lg" />
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
                      {/* <tr className="border border-acsentColor">
                        <th className="p-2 border border-acsentColor">
                          File Name
                        </th>
                        <td className="border border-acsentColor p-2 ">
                          imaginebynornetics-IBN001.png
                        </td>
                      </tr> */}
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          File Size
                        </th>
                        <td className="border border-acsentColor p-2">
                          {fileSize}
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          Aspect Ratio
                        </th>
                        <td className="border border-acsentColor p-2">
                          {item.img_ratio}
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          Engine
                        </th>
                        <td className="border border-acsentColor p-2">
                          {item.img_engine}
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          Created By
                        </th>
                        <td className="border border-acsentColor p-2">
                          {item.created_by}
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          Created Date
                        </th>
                        <td className="border border-acsentColor p-2">
                          {date}
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">Views</th>
                        <td className="border border-acsentColor p-2">
                          {item.img_views} <Visibility className="text-sm" />
                        </td>
                      </tr>
                      <tr>
                        <th className="p-2 border border-acsentColor">
                          Downloads
                        </th>
                        <td className="border border-acsentColor p-2">
                          {item.img_download} <Download className="text-sm" />
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
                <button
                  onClick={() => downloadImage(item.img_path, item.id)}
                  id="download"
                  className="w-full h-auto p-2 rounded-lg font-bold ring-1 ring-acsentColor hover:bg-acsentBtn hover:text-acsentColor duration-100"
                >
                  <Download className="animate-bounce" /> Download Image
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default DetailsImage;
