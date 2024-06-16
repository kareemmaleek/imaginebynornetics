import { LoginRounded } from "@mui/icons-material";
import React from "react";

function index() {
  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-6/12 h-[400px] rounded-lg bg-secondaryColor shadow-lg flex">
          <div className="w-6/12 h-full flex justify-center items-center">
            <div className="w-auto h-auto flex flex-col">
              <div className="w-full h-auto flex justify-center items-center mb-3">
                <div className="flex">
                  <img
                    src="./assets/images/logo_nornetics.png"
                    alt="imaginebynornetics"
                    width={100}
                  />
                  <div className="w-full h-auto">
                    <h1 className="ml-2 text-lg font-normal">imagine</h1>
                    <h1 className="ml-2 text-lg font-normal">by nornetics.</h1>
                  </div>
                </div>
              </div>

              <div className="w-[200px] text-center">
                <p className="text-xs italic">
                  become creator and share your ai arts with us!.
                </p>
              </div>
            </div>
          </div>
          <div className="w-6/12 h-full p-10 flex justify-center items-center">
            <div className="w-full h-auto">
              <p className="text-sm italic mb-5">
                Sign in using email and password to access creator panel
              </p>
              <div className="w-full h-auto mb-5">
                <label
                  htmlFor="email-log"
                  className="font-bold text-thirdColor"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email-log"
                  placeholder="Email address"
                  className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
                />
              </div>
              <div className="w-full h-auto mb-5">
                <label htmlFor="pwd-log" className="font-bold text-thirdColor">
                  Password
                </label>
                <input
                  type="password"
                  id="pwd-log"
                  placeholder="Enter your password"
                  className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
                />
              </div>

              <button className="w-full h-auto p-1 border border-acsentColor rounded-lg hover:bg-acsentColor hover:text-mainColor hover:font-bold">
                Sign In <LoginRounded />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs italic mt-5">
          imaginebynornetics &copy; 2024, app version v1.0
        </p>
      </div>
    </>
  );
}

export default index;
