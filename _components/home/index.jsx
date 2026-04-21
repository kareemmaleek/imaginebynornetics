import React, { useState } from "react";
import NavBar from "../navbar";
import { IconMenu2, IconX } from "@tabler/icons-react";

function Home({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[250px] min-w-[250px] h-screen sticky top-0 bg-secondaryColor shadow-lg z-[80]">
        <NavBar />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-secondaryColor shadow-lg z-[70] transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-mainColor hover:bg-acsentBtn text-acsentColor z-50"
        >
          <IconX size={18} />
        </button>
        <NavBar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-50 w-full h-14 bg-secondaryColor flex items-center justify-between px-4 shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-mainColor text-acsentColor"
          >
            <IconMenu2 size={24} />
          </button>
          <div className="w-fit">
            <img
              src="/assets/images/logo-ibn.png"
              alt="imaginebynornetics"
              width={120}
              className="ml-3"
            />
          </div>
        </div>
        <main className="w-full">{children}</main>
      </div>

      <div className="hidden md:block fixed bottom-5 right-10 italic text-xs p-3 rounded-lg bg-black/30 backdrop-blur-md z-40">
        <p>imagine by nornetics app version v2.0</p>
      </div>
    </div>
  );
}

export default Home;
