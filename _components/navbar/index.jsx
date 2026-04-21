import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconChartBar,
  IconHome,
  IconLoader2,
  IconLogin,
  IconLogout,
  IconPalette,
  IconPasswordUser,
  IconPhoto,
  IconShieldCheck,
  IconUsers,
  IconWriting,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "@/common/AuthContext";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// Modal defined OUTSIDE NavBar to prevent re-creation on parent re-render
function Modal({ show, onClose, title, children }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-[90%] max-w-md bg-secondaryColor rounded-xl border border-acsentColor/20 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-mainColor hover:bg-red-500/20 text-thirdColor hover:text-red-400 transition-colors"
        >
          <IconX size={14} />
        </button>
        <h2 className="text-lg font-bold text-acsentColor mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function NavBar({ onNavigate }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const { user, loading, logout, login, checkAuth } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
    router.push("/");
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const initials = name
      .split(/(?=[A-Z])|[\s_-]/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("");

    if (initials.length >= 3) return initials.substring(0, 3);
    if (initials.length >= 2) return initials.substring(0, 2);
    if (name.length >= 3) return name.substring(0, 3).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getGradient = (name) => {
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

  const showToast = (msg, type = "error") => {
    Toastify({
      text: msg,
      duration: 2000,
      close: true,
      position: "center",
      stopOnFocus: true,
      className: type === "error" ? "ibn-error" : "ibn-success",
    }).showToast();
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return showToast("Username cannot be empty");
    setFormLoading(true);

    try {
      const token = localStorage.getItem("ibn_token");
      const res = await axios.patch(
        "/api/users/changeUsername",
        { username: newUsername.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.error === 0) {
        login(res.data.token, res.data.user);
        setShowUsernameModal(false);
        setNewUsername("");
        showToast(res.data.message, "success");
      } else {
        showToast(res.data.message);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update username");
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return showToast("All fields are required");
    }
    setFormLoading(true);

    try {
      const token = localStorage.getItem("ibn_token");
      const res = await axios.patch(
        "/api/users/changePassword",
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.error === 0) {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast(res.data.message, "success");
      } else {
        showToast(res.data.message);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-0 items-center justify-between">
        <div className="w-full h-fit mt-5 flex md:flex p-5 items-center justify-center">
          <img
            src="/assets/images/logo-ibn.png"
            alt="imaginebynornetics"
            width={160}
          />
        </div>

        <div
          className="w-full h-full p-5 flex-col relative overflow-y-auto"
          data-lenis-prevent
        >
          {user ? (
            <h2 className="text-sm mb-5 bg-mainColor p-3 shadow-inner rounded-lg">
              Hi <strong className="italic">{user.username}</strong>, welcome
              back. lets show your ai arts to the worlds!
            </h2>
          ) : (
            <h2 className="text-sm mb-5 bg-mainColor p-3 shadow-inner rounded-lg">
              Welcome, <strong className="italic">Guest</strong>. Sign in to
              upload your ai arts!
            </h2>
          )}

          <div className="w-full h-auto mb-5">
            <p className="text-xs text-acsentColor">Explore</p>
            <Link href={"/"}>
              <div
                onClick={onNavigate}
                className={`w-full h-auto p-4 py-3 my-1 group/home cursor-pointer  ${currentPath === "/" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg text-sm`}
              >
                <span
                  className={`font-semibold ${currentPath === "/" && "text-thirdColor"} group-hover/home:text-thirdColor flex items-center tracking-wide`}
                >
                  <IconHome
                    className="text-acsentColor inline-block mr-2"
                    size={20}
                  />{" "}
                  Home
                </span>
              </div>
            </Link>
          </div>

          {user && (
            <div className="w-full h-auto mb-5">
              <p className="text-xs text-acsentColor">Creator Menu</p>

              <Link href={"/upload-arts"}>
                <div
                  onClick={onNavigate}
                  className={`w-full h-auto p-4 py-3 my-1 group/upart cursor-pointer ${currentPath === "/upload-arts" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm tracking-wide ${currentPath === "/upload-arts" && "text-thirdColor"} group-hover/upart:text-thirdColor`}
                  >
                    <IconPalette
                      className="text-acsentColor inline-block mr-2"
                      size={20}
                    />{" "}
                    Upload Arts
                  </span>
                </div>
              </Link>
              <Link href={"/my-collections"}>
                <div
                  onClick={onNavigate}
                  className={`w-full h-auto p-4 py-3 my-1 group/collect cursor-pointer ${currentPath === "/my-collections" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm tracking-wide ${currentPath === "/my-collections" && "text-thirdColor"} group-hover/collect:text-thirdColor`}
                  >
                    <IconPhoto
                      className="text-acsentColor inline-block mr-2"
                      size={20}
                    />{" "}
                    My Collections
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* ADMIN MENU */}
          {user && user.is_admin && (
            <div className="w-full h-auto mb-5">
              <p className="text-xs text-acsentColor">Admin Panel</p>

              <Link href={"/admin/users"}>
                <div
                  onClick={onNavigate}
                  className={`w-full h-auto p-4 py-3 my-1 group/ausers cursor-pointer ${currentPath === "/admin/users" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm tracking-wide ${currentPath === "/admin/users" && "text-thirdColor"} group-hover/ausers:text-thirdColor`}
                  >
                    <IconUsers
                      className="text-acsentColor inline-block mr-2"
                      size={20}
                    />{" "}
                    Users
                  </span>
                </div>
              </Link>

              <Link href={"/admin/media-approval"}>
                <div
                  onClick={onNavigate}
                  className={`w-full h-auto p-4 py-3 my-1 group/approval cursor-pointer ${currentPath === "/admin/media-approval" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm tracking-wide ${currentPath === "/admin/media-approval" && "text-thirdColor"} group-hover/approval:text-thirdColor`}
                  >
                    <IconPhoto
                      className="text-acsentColor inline-block mr-2"
                      size={20}
                    />{" "}
                    Media Approval
                  </span>
                </div>
              </Link>

              <Link href={"/admin/traffic"}>
                <div
                  onClick={onNavigate}
                  className={`w-full h-auto p-4 py-3 my-1 group/traffic cursor-pointer ${currentPath === "/admin/traffic" && "bg-mainColor"} hover:bg-mainColor text-acsentColor rounded-lg`}
                >
                  <span
                    className={`font-semibold text-sm tracking-wide ${currentPath === "/admin/traffic" && "text-thirdColor"} group-hover/traffic:text-thirdColor`}
                  >
                    <IconChartBar
                      className="text-acsentColor inline-block mr-2"
                      size={20}
                    />{" "}
                    Traffic Report
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="w-full h-fit">
          {!user ? (
            <Link href="/access">
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="w-full h-fit flex gap-2 items-center justify-center p-4 md:p-5 hover:bg-mainColor/50 cursor-pointer transition-colors border border-transparent hover:border-mainColor text-sm font-semibold"
              >
                <IconLogin size={20} />
                Sign In as Creator
              </div>
            </Link>
          ) : (
            <div ref={profileRef} className="relative w-full">
              {openProfile && (
                <div className="absolute bottom-[105%] right-0 md:bottom-0 md:left-[103%] w-fit bg-secondaryColor border border-acsentColor/20 p-2 shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-1 items-center rounded-lg">
                  <div className="w-full flex border border-acsentColor/20 items-center gap-2 py-3 px-2 text-sm text-acsentColor bg-acsentColor/10  rounded-md transition-all whitespace-nowrap ">
                    {user.email}
                  </div>

                  <button
                    onClick={() => {
                      setShowUsernameModal(true);
                      setOpenProfile(false);
                      setNewUsername(user.username);
                    }}
                    className="w-full flex items-center gap-2 py-3 px-2 text-sm text-thirdColor hover:bg-mainColor hover:text-acsentColor  rounded-md transition-all whitespace-nowrap"
                  >
                    <IconWriting size={18} />
                    Change Username
                  </button>

                  <button
                    onClick={() => {
                      setShowPasswordModal(true);
                      setOpenProfile(false);
                    }}
                    className="w-full flex items-center gap-2 py-3 px-2 text-sm text-thirdColor hover:bg-mainColor hover:text-acsentColor  rounded-md transition-all whitespace-nowrap"
                  >
                    <IconPasswordUser size={18} />
                    Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-3 px-2 text-sm text-red-500 hover:bg-red-500/20  rounded-md transition-all whitespace-nowrap"
                  >
                    <IconLogout size={18} />
                    Logout Session
                  </button>
                </div>
              )}
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="w-full h-fit flex gap-2 items-center justify-between p-4 md:p-5 hover:bg-mainColor/50 cursor-pointer transition-colors border border-transparent hover:border-mainColor"
              >
                <div className="w-fit flex gap-2 items-center">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-tr ${getGradient(user.username)} shadow-md flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/10`}
                  >
                    {getInitials(user.username)}
                  </div>
                  <div className="w-fit h-auto flex flex-col justify-center">
                    <div className="text-sm font-semibold text-acsentColor">
                      {user.username}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-thirdColor">
                      {user.is_admin ? "Admin" : "Personal"}
                    </div>
                  </div>
                </div>
                {openProfile ? (
                  <IconCaretUpFilled
                    size={14}
                    className="text-acsentColor opacity-70"
                  />
                ) : (
                  <IconCaretDownFilled
                    size={14}
                    className="text-acsentColor opacity-70"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE USERNAME MODAL */}
      <Modal
        show={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        title="Change Username"
      >
        <form onSubmit={handleChangeUsername}>
          <label className="text-xs font-semibold text-thirdColor uppercase tracking-wider">
            New Username
          </label>
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter new username"
            className="w-full mt-2 p-3 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
          />
          <p className="text-[10px] text-thirdColor/60 mt-1 mb-4">
            Only letters, numbers, underscores, and dots. Min 3 characters.
          </p>
          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2.5 bg-acsentColor/10 border border-acsentColor/20 rounded-lg text-sm font-semibold text-acsentColor hover:bg-acsentColor/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formLoading ? (
              <>
                <IconLoader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <IconCheck size={16} />
                Save Username
              </>
            )}
          </button>
        </form>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-thirdColor uppercase tracking-wider">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full mt-2 p-3 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-thirdColor uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mt-2 p-3 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-thirdColor uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full mt-2 p-3 bg-mainColor border border-acsentColor/20 rounded-lg text-sm text-acsentColor outline-none focus:border-acsentColor/50 transition-colors"
            />
          </div>
          <p className="text-[10px] text-thirdColor/60">
            New password must be at least 6 characters.
          </p>
          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2.5 bg-acsentColor/10 border border-acsentColor/20 rounded-lg text-sm font-semibold text-acsentColor hover:bg-acsentColor/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formLoading ? (
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
      </Modal>
    </>
  );
}

export default NavBar;
