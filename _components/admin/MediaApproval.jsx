import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  IconPhoto,
  IconCheck,
  IconX,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
} from "@tabler/icons-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/router";
import ImageZoom from "../ImageZoom";

function MediaApproval() {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoomImg, setZoomImg] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_admin) router.push("/");
  }, [user]);

  const fetchMedias = async () => {
    const token = localStorage.getItem("ibn_token");
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get("/api/admin/media-approval", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 20, status: statusFilter },
      });

      if (res.data.error === 0) {
        setMedias(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to fetch media",
        duration: 2000,
        position: "center",
        className: "ibn-error",
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedias();
  }, [page, statusFilter]);

  const handleAction = async (uid, action) => {
    const token = localStorage.getItem("ibn_token");
    try {
      await axios.patch(
        "/api/admin/media-approval",
        { uid, action },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchMedias();
      Toastify({
        text: `Media ${action} successfully`,
        duration: 1500,
        position: "center",
        className: "ibn-success",
      }).showToast();
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed",
        duration: 2000,
        position: "center",
        className: "ibn-error",
      }).showToast();
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
      pending: "bg-yellow-500/20 text-yellow-400",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${map[status] || "bg-acsentColor/10 text-thirdColor"}`}
      >
        {status || "pending"}
      </span>
    );
  };

  return (
    <div className="w-full h-auto p-3 md:p-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <IconPhoto size={24} className="text-acsentColor" />
          Media Approval
        </h1>
        <p className="text-sm italic text-thirdColor">
          review and approve uploaded media
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-6">
        <IconFilter size={16} className="text-thirdColor" />
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setPage(1);
              setStatusFilter(s);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              statusFilter === s
                ? "bg-acsentColor/20 text-acsentColor border border-acsentColor"
                : "bg-secondaryColor text-thirdColor border border-acsentColor/20 hover:text-acsentColor"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* IMAGE ZOOM */}
      {zoomImg && (
        <ImageZoom
          src={zoomImg.src}
          alt={zoomImg.alt}
          onClose={() => setZoomImg(null)}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader2 size={28} className="animate-spin text-acsentColor" />
          <span className="ml-3 text-sm text-thirdColor italic">
            Loading media...
          </span>
        </div>
      ) : medias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-thirdColor">
          <IconPhoto size={48} className="opacity-50 mb-3" />
          <p className="text-sm italic">No media found.</p>
        </div>
      ) : (
        <>
          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {medias.map((m) => (
              <div
                key={m.uid}
                className="bg-secondaryColor rounded-xl border border-acsentColor/10 overflow-hidden hover:border-acsentColor/30 transition-colors"
              >
                <div className="w-full h-40 overflow-hidden bg-mainColor/50">
                  <img
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomImg({
                        src: m.media_path,
                        alt: m.media_name,
                      });
                    }}
                    src={m.media_thumb}
                    alt={m.media_name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-thirdColor">
                      by{" "}
                      <strong className="text-acsentColor">
                        {m.created_by}
                      </strong>
                    </span>
                    {statusBadge(m.approval_status)}
                  </div>
                  <p className="text-xs text-thirdColor mb-1">
                    {m.media_engine} • {m.media_ratio} • {m.content_type}
                  </p>
                  <p className="text-[10px] text-thirdColor/60 mb-3">
                    {moment(m.created_at).format("DD MMM YYYY, HH:mm")}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(m.uid, "approved")}
                      disabled={m.approval_status === "approved"}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      <IconCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(m.uid, "rejected")}
                      disabled={m.approval_status === "rejected"}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-30 flex items-center justify-center gap-1"
                    >
                      <IconX size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-secondaryColor border border-acsentColor/20 text-thirdColor hover:text-acsentColor disabled:opacity-30 transition-colors"
              >
                <IconChevronLeft size={16} />
              </button>
              <span className="text-sm text-thirdColor">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-secondaryColor border border-acsentColor/20 text-thirdColor hover:text-acsentColor disabled:opacity-30 transition-colors"
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MediaApproval;
