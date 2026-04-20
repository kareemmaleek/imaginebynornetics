import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import moment from "moment";
import { useAuth } from "@/common/AuthContext";
import {
  IconEye,
  IconDownload,
  IconPhoto,
  IconHeart,
} from "@tabler/icons-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function MyCollections() {
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getMyImages = async () => {
    const token = localStorage.getItem("ibn_token");
    if (!token) return;

    try {
      const response = await axios.get("/api/gallery/getMyImages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error === 0) {
        // Group images by month-year
        const grouped = {};
        response.data.data.forEach((item) => {
          const monthYear = moment(item.created_at).format("MMMM, YYYY");
          if (!grouped[monthYear]) {
            grouped[monthYear] = [];
          }
          grouped[monthYear].push(item);
        });

        setCollections(grouped);
      }
    } catch (err) {
      Toastify({
        text: "Failed to load collections",
        duration: 2000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibn-error",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
        },
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyImages();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="text-sm text-thirdColor italic animate-pulse">
          Loading your collections...
        </span>
      </div>
    );
  }

  const monthKeys = Object.keys(collections);

  return (
    <>
      <div className="w-full h-screen p-3 md:p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold">My Collections</h1>
          <p className="text-sm italic text-thirdColor">
            all your uploaded ai arts in one place
          </p>
        </div>

        {monthKeys.length === 0 ? (
          <div className="w-full h-[400px] flex flex-col justify-center items-center text-thirdColor">
            <IconPhoto size={48} className="mb-3 opacity-50" />
            <p className="text-sm italic">You haven't uploaded any arts yet.</p>
            <Link href="/upload-arts">
              <span className="text-acsentColor text-sm mt-2 underline cursor-pointer hover:text-thirdColor">
                Upload your first art →
              </span>
            </Link>
          </div>
        ) : (
          monthKeys.map((month, idx) => {
            return (
              <div key={idx} className="w-full h-auto mb-8">
                <h2 className="text-lg font-bold mb-3">{month}</h2>
                <div className="w-full h-auto flex flex-wrap gap-0">
                  {collections[month].map((item, x) => {
                    return (
                      <Link href={`/details/${item.uid}`} key={x}>
                        <div className="group relative">
                          <img
                            src={item.img_path}
                            alt={item.img_name}
                            className="w-40 h-40 object-cover cursor-pointer hover:shadow-inner shadow-md duration-300"
                          />
                          <div className="hidden group-hover:flex absolute bottom-0 left-0 w-full bg-secondaryColor/40 rounded-b-lg p-2 justify-between items-center text-xs">
                            <span className="flex items-center gap-1">
                              <IconEye size={12} /> {item.img_views}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconHeart size={12} /> 52
                            </span>
                            <span className="flex items-center gap-1">
                              <IconDownload size={12} /> {item.img_download}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default MyCollections;
