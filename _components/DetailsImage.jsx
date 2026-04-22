import {
  IconArrowLeft,
  IconDownload,
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconX,
  IconZoomIn,
} from "@tabler/icons-react";
import ImageZoom from "./ImageZoom";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/common/AuthContext";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function DetailsImage({ media_id }) {
  const [dataImage, setDataImage] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("ibn_token") : null;

  const getImage = async (id) => {
    try {
      const response = await axios.get(
        `/api/gallery/getImage?uid=${id}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {},
      );

      const mediaData = response.data.data;

      // Access Control: If not approved, must be owner or admin
      if (mediaData.approval_status !== "approved") {
        const isOwner = user && user.uid === mediaData.created_by;
        const isAdmin = user && user.is_admin;

        if (!isOwner && !isAdmin) {
          Toastify({
            text: "This media is pending review and only visible to the owner.",
            duration: 3000,
            position: "center",
            className: "ibn-error",
          }).showToast();
          router.push("/");
          return;
        }
      }

      setDataImage(mediaData);
    } catch (err) {
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
    }
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
    if (media_id !== "") {
      getImage(media_id);
      upViews(media_id);
    }
    //console.log(media_id);
  }, [media_id]);

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

  const updateStatsLike = async () => {
    try {
      if (!token) {
        return Toastify({
          text: "You must sign in first to like this!",
          duration: 2000,
          close: true,
          position: "center",
          stopOnFocus: true,
          escapeMarkup: true,
          className: "ibn-error",
        }).showToast();
      }

      const res = await axios.patch(
        `/api/gallery/stats?type=like&id=${media_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        await getImage(media_id);
      }
    } catch (err) {
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
    }
  };

  const getInitials = (name = "ibn") => {
    if (!name) return "??";
    const initials = name
      .split(/(?=[A-Z])|[\s_-]/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    if (initials.length >= 3) return initials.substring(0, 3);
    if (initials.length >= 2) return initials.substring(0, 2);
    if (name.length >= 3) return name.substring(0, 3).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getGradient = (name = "ibn") => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-fuchsia-500",
      "from-cyan-500 to-sky-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  useEffect(() => {
    console.log(dataImage);
  }, [dataImage]);

  return (
    <>
      <div
        className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${dataImage.media_path}')` }}
      >
        <div className="w-full min-h-screen lg:h-full p-4 lg:p-5 pt-8 lg:pt-10 flex flex-col lg:flex-row justify-between gap-5 backdrop-brightness-[25%] backdrop-blur-xl">
          <div className="w-full lg:w-fit h-fit ">
            <Link href={`/`}>
              <span className="w-10 h-10 bg-secondaryColor hover:bg-acsentBtn hover:text-acsentColor cursor-pointer rounded-full flex justify-center items-center shadow-lg">
                <IconArrowLeft size={20} />
              </span>
            </Link>
          </div>

          <div className="w-full h-fit lg:h-full flex justify-center items-center">
            <div className="w-full md:w-fit h-fit lg:h-full relative flex justify-center">
              {!loaded && dataImage.media_path && (
                <div className="absolute inset-0 flex items-center justify-center bg-mainColor/40 backdrop-blur-md rounded-lg z-[5]">
                  <img
                    src="/assets/images/logo-ibn.png"
                    alt="Loading..."
                    className="w-20 h-20 object-contain animate-pulse-slow opacity-50"
                  />
                </div>
              )}
              <img
                src={dataImage.media_path}
                onLoad={() => setLoaded(true)}
                onClick={() => setZoomOpen(true)}
                className={`w-full h-auto lg:h-full lg:w-auto rounded-lg shadow-2xl transition-opacity duration-500 cursor-zoom-in ${loaded ? "opacity-100" : "opacity-0"}`}
              />

              <div className="absolute top-3 left-3 flex gap-2">
                <div
                  onClick={() => setZoomOpen(true)}
                  className="p-1 px-2 rounded-full bg-secondaryColor/80 backdrop-blur-md flex items-center gap-1 text-sm hover:bg-acsentBtn cursor-pointer transition-all border border-white/10"
                  title="Zoom Image"
                >
                  <IconZoomIn size={16} />
                </div>
              </div>

              <div
                onClick={() => updateStatsLike()}
                className="absolute top-3 right-3 p-1 px-2 rounded-full bg-secondaryColor/80 backdrop-blur-md flex items-center gap-1 text-sm hover:bg-acsentBtn cursor-pointer transition-all border border-white/10"
              >
                <span>{dataImage.media_likes}</span>
                {dataImage?.toggle_like ? (
                  <IconHeartFilled size={16} />
                ) : (
                  <IconHeart size={16} />
                )}
              </div>
            </div>
          </div>

          {zoomOpen && (
            <ImageZoom
              src={dataImage.media_path}
              alt={dataImage.media_name}
              onClose={() => setZoomOpen(false)}
            />
          )}

          <div className="w-full lg:w-[400px] h-auto flex flex-col">
            <div className="w-full h-auto p-5 bg-secondaryColor rounded-lg mb-5 border border-acsentColor/20">
              <div className="w-full h-auto flex items-center gap-2 mb-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getGradient(dataImage?.creator_name)} shadow-md flex items-center justify-center text-sm font-bold text-white uppercase border border-white/10`}
                >
                  {getInitials(dataImage?.creator_name)}
                </div>
                <div className="w-fit flex flex-col">
                  <h1 className="font-semibold hover:underline cursor-pointer">
                    {dataImage.creator_name || "Unknown Creator"}
                  </h1>
                  <p className="text-xs italic text-thirdColor">
                    {moment(dataImage.created_at).fromNow()}
                  </p>
                </div>
              </div>

              <div className="w-full flex gap-1 items-center mb-5">
                <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
                  <div className="w-full h-auto flex items-center gap-1">
                    <IconEye size={14} />
                    <span className="text-xs font-semibold">
                      {dataImage.media_views || 0}
                    </span>
                  </div>
                </div>
                <div className="w-fit p-1 px-2 rounded-md bg-mainColor">
                  <div className="w-full h-auto flex items-center gap-1">
                    <IconDownload size={14} />
                    <span className="text-xs font-semibold">
                      {dataImage.media_download || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full h-auto mb-5">
                <h1 className="font-semibold text-sm my-1">Details</h1>
                <div className="w-full flex flex-wrap gap-1 ">
                  <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                    <span className="text-thirdColor">AI Engine:</span>
                    {dataImage.media_engine}
                  </div>
                  <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                    <span className="text-thirdColor">Ratio:</span>
                    {dataImage.media_ratio}
                  </div>
                  <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                    <span className="text-thirdColor">Size:</span>
                    {dataImage.file_size}
                  </div>
                  <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                    <span className="text-thirdColor">Dimensions:</span>
                    {dataImage.media_width && dataImage.media_height
                      ? `${dataImage.media_width} x ${dataImage.media_height}`
                      : "Unknown"}
                  </div>
                  <div className="w-fit p-2 px-3 text-xs rounded-md bg-mainColor flex items-center gap-2">
                    <span className="text-thirdColor">Content Type:</span>
                    {dataImage.content_type}
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
                  onClick={() =>
                    downloadImage(dataImage.media_path, dataImage.id)
                  }
                  id="download"
                  className="w-full lg:w-fit h-auto p-2 text-xs rounded-lg font-semibold border bg-acsentColor/10 border-acsentColor/20 text-thirdColor hover:bg-acsentBtn hover:text-acsentColor transition-all shadow-lg active:scale-95"
                >
                  <IconDownload
                    className="animate-bounce inline-block mr-2"
                    size={16}
                  />{" "}
                  Download Media
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsImage;
