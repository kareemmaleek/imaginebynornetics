import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconHome,
  IconLogin,
  IconLogout,
  IconPalette,
  IconPasswordUser,
  IconPhoto,
  IconWriting,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "@/common/AuthContext";

function NavBar({ onNavigate }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const { user, loading, logout } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
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

  return (
    <>
      <div className="w-full h-full flex flex-col gap-0 items-center">
        <div className="w-full h-auto mt-5 flex p-5 items-center justify-center">
          <img
            src="./assets/images/logo-ibn.png"
            alt="imaginebynornetics"
            width={160}
          />
        </div>

        <div className="w-full h-full p-5 flex-col relative">
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

          <div className="w-full absolute bottom-3 left-0">
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
                  <div className="absolute bottom-0 left-[103%] w-fit bg-secondaryColor border border-acsentColor/30 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-1 items-center rounded-lg">
                    <div className="w-full flex border border-acsentColor/30 items-center gap-2 py-3 px-2 text-sm text-acsentColor bg-acsentColor/10  rounded-md transition-all whitespace-nowrap ">
                      {user.email}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 py-3 px-2 text-sm text-acsentColor hover:bg-mainColor  rounded-md transition-all whitespace-nowrap"
                    >
                      <IconWriting size={18} />
                      Change Username
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 py-3 px-2 text-sm text-acsentColor hover:bg-mainColor  rounded-md transition-all whitespace-nowrap"
                    >
                      <IconPasswordUser size={18} />
                      Change Password
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 py-3 px-2 text-sm text-acsentColor hover:bg-mainColor  rounded-md transition-all whitespace-nowrap"
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 shadow-md"></div>
                    <div className="w-fit h-auto flex flex-col justify-center">
                      <div className="text-sm font-semibold text-acsentColor">
                        {user.username}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-thirdColor">
                        Personal
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
      </div>
    </>
  );
}

export default NavBar;
