import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import {
  IconUsers,
  IconSearch,
  IconShieldCheck,
  IconShieldOff,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconPasswordUser,
  IconCheck,
  IconX,
  IconPlayerPlay,
  IconPlayerPause,
  IconBan,
} from "@tabler/icons-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/router";

const STATUS_LABELS = {
  0: { text: "Active", color: "bg-green-500/20 text-green-400" },
  1: { text: "Suspended", color: "bg-yellow-500/20 text-yellow-400" },
  2: { text: "Deactivated", color: "bg-red-500/20 text-red-400" },
};

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Password modal
  const [pwdModal, setPwdModal] = useState(false);
  const [pwdUser, setPwdUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.is_admin) router.push("/");
  }, [user]);

  const showToast = (msg, type = "error") => {
    Toastify({
      text: msg,
      duration: 2000,
      close: true,
      position: "center",
      className: type === "error" ? "ibn-error" : "ibn-success",
    }).showToast();
  };

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("ibn_token");
    if (!token) return;
    setLoading(true);

    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 20, search: searchQuery },
      });

      if (res.data.error === 0) {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchInput);
  };

  const toggleAdmin = async (uid) => {
    const token = localStorage.getItem("ibn_token");
    try {
      await axios.patch(
        "/api/admin/users",
        { uid, action: "toggle_admin" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchUsers();
      showToast("Admin status updated", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update");
    }
  };

  const changeUserStatus = async (uid, statusVal) => {
    const token = localStorage.getItem("ibn_token");
    try {
      const res = await axios.patch(
        "/api/admin/users",
        { uid, action: "change_status", status: statusVal },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchUsers();
      showToast(res.data.message, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return showToast("Password must be at least 6 characters");
    }
    setPwdLoading(true);
    const token = localStorage.getItem("ibn_token");

    try {
      const res = await axios.patch(
        "/api/admin/users",
        { uid: pwdUser.uid, action: "change_password", newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast(res.data.message, "success");
      setPwdModal(false);
      setNewPassword("");
      setPwdUser(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="w-full h-auto p-3 md:p-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <IconUsers size={24} className="text-acsentColor" />
          User Management
        </h1>
        <p className="text-sm italic text-thirdColor">
          manage all registered users •{" "}
          <span className="text-acsentColor font-semibold">{total}</span> total
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-thirdColor"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search username or email..."
            className="w-full pl-9 pr-3 py-2 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-acsentColor/10 border border-acsentColor/20 rounded-lg text-sm font-semibold text-acsentColor hover:bg-acsentColor/20 transition-colors"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearchQuery("");
              setPage(1);
            }}
            className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <IconX size={14} className="inline mr-1" />
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader2 size={28} className="animate-spin text-acsentColor" />
          <span className="ml-3 text-sm text-thirdColor italic">
            Loading users...
          </span>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto bg-secondaryColor rounded-xl border border-acsentColor/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-acsentColor/10 text-thirdColor text-xs uppercase tracking-wider">
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Admin</th>
                  <th className="p-4 text-left">Joined</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-thirdColor italic"
                    >
                      {searchQuery
                        ? `No users found for "${searchQuery}"`
                        : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const status = STATUS_LABELS[u.status] || STATUS_LABELS[0];
                    return (
                      <tr
                        key={u.uid}
                        className="border-b border-acsentColor/5 hover:bg-mainColor/30 transition-colors"
                      >
                        <td className="p-4 font-semibold text-acsentColor">
                          {u.username}
                        </td>
                        <td className="p-4 text-thirdColor">{u.email}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {u.is_admin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                              <IconShieldCheck size={12} /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-acsentColor/10 text-thirdColor rounded-full text-xs">
                              User
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-thirdColor text-xs">
                          {moment(u.created_at).format("DD MMM YYYY")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {/* Toggle Admin */}
                            <button
                              onClick={() => toggleAdmin(u.uid)}
                              title={u.is_admin ? "Remove Admin" : "Make Admin"}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                u.is_admin
                                  ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                                  : "bg-acsentColor/10 border border-acsentColor/20 text-acsentColor hover:bg-acsentColor/20"
                              }`}
                            >
                              {u.is_admin ? (
                                <IconShieldOff size={14} />
                              ) : (
                                <IconShieldCheck size={14} />
                              )}
                            </button>

                            {/* Change Password */}
                            <button
                              onClick={() => {
                                setPwdUser(u);
                                setPwdModal(true);
                                setNewPassword("");
                              }}
                              title="Change Password"
                              className="p-1.5 rounded-lg text-xs bg-acsentColor/10 border border-acsentColor/20 text-acsentColor hover:bg-acsentColor/20 transition-colors"
                            >
                              <IconPasswordUser size={14} />
                            </button>

                            {/* Status Actions */}
                            {u.status !== 0 && (
                              <button
                                onClick={() => changeUserStatus(u.uid, 0)}
                                title="Activate"
                                className="p-1.5 rounded-lg text-xs bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                              >
                                <IconPlayerPlay size={14} />
                              </button>
                            )}
                            {u.status !== 1 && (
                              <button
                                onClick={() => changeUserStatus(u.uid, 1)}
                                title="Suspend"
                                className="p-1.5 rounded-lg text-xs bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                              >
                                <IconPlayerPause size={14} />
                              </button>
                            )}
                            {u.status !== 2 && (
                              <button
                                onClick={() => changeUserStatus(u.uid, 2)}
                                title="Deactivate"
                                className="p-1.5 rounded-lg text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <IconBan size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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

      {/* PASSWORD CHANGE MODAL */}
      {pwdModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPwdModal(false)}
          />
          <div
            className="relative w-[90%] max-w-md bg-secondaryColor rounded-xl border border-acsentColor/20 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPwdModal(false)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-mainColor hover:bg-red-500/20 text-thirdColor hover:text-red-400 transition-colors"
            >
              <IconX size={14} />
            </button>
            <h2 className="text-lg font-bold text-acsentColor mb-1">
              Change Password
            </h2>
            <p className="text-xs text-thirdColor mb-5">
              for user:{" "}
              <strong className="text-acsentColor">{pwdUser?.username}</strong>{" "}
              ({pwdUser?.email})
            </p>
            <form onSubmit={handleChangePassword}>
              <label className="text-xs font-semibold text-thirdColor uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full mt-2 p-3 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={pwdLoading}
                className="w-full mt-4 py-2.5 bg-acsentColor/10 border border-acsentColor/20 rounded-lg text-sm font-semibold text-acsentColor hover:bg-acsentColor/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {pwdLoading ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <IconCheck size={16} />
                    Save Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPanel;
