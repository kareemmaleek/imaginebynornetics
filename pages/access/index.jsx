import Login from "@/_components/access/Login";
import Signup from "@/_components/access/Signup";

import React, { useState } from "react";

function index() {
  const [accessOpt, setAccessOpt] = useState(false);

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center p-4 md:p-0">
        <div className="w-full md:w-8/12 lg:w-6/12 h-auto md:h-[500px] rounded-lg bg-secondaryColor shadow-lg flex flex-col md:flex-row">
          <div className="w-full md:w-6/12 h-auto py-10 md:h-full flex justify-center items-center">
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
          <div className="w-full md:w-6/12 h-full p-6 md:p-10 flex justify-center items-center">
            <div className="w-full h-auto">
              {!accessOpt ? <Login /> : <Signup />}
              <p className="mt-5 text-sm">
                {!accessOpt
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <strong
                  onClick={() => setAccessOpt(!accessOpt)}
                  className="italic cursor-pointer"
                >
                  {!accessOpt ? "Sign up now!" : "Login here!"}
                </strong>
              </p>
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
