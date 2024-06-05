import Link from "next/link";
import React from "react";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

function NavBar() {
  return (
    <>
      <div className="w-full h-auto flex p-5 items-center justify-center">
        <img
          src="./assets/images/logo_nornetics.png"
          alt="imaginebynornetics"
          width={70}
        />
        <div className="w-full h-auto">
          <h1 className="ml-2 text-lg font-normal">imagine</h1>
          <h1 className="ml-2 text-lg font-normal">by nornetics.</h1>
        </div>
      </div>

      <div className="w-full h-[530px] p-5 flex-col">
        <div className="w-full h-auto mb-5">
          <p className="text-xs text-acsentColor">Explore</p>

          <div className="w-full h-auto p-4 mt-2 bg-mainColor text-acsentColor rounded-lg">
            <span className="font-bold text-thirdColor">
              <SpaceDashboardIcon className="text-acsentColor" /> Home
            </span>
          </div>
        </div>

        <div className="w-full h-auto">
          <p className="text-xs text-acsentColor">Filters</p>

          <div className="w-full h-auto p-4 mt-2 bg-mainColor text-acsentColor rounded-lg">
            <div className="w-full h-auto mb-3">
              <span className="text-xs">Aspect Ratio</span>
            </div>

            <div class="flex items-center mb-2">
              <input
                defaultChecked
                type="radio"
                name="difa"
                value=""
                id="169"
                className="w-4 h-4"
              />
              <label
                htmlFor="169"
                class="ms-2 text-sm font-medium text-thirdColor"
              >
                16:9
              </label>
            </div>
            <div class="flex items-center mb-2">
              <input
                type="radio"
                name="difa"
                value=""
                id="43"
                className="w-4 h-4"
              />
              <label
                htmlFor="43"
                class="ms-2 text-sm font-medium text-thirdColor"
              >
                4:3
              </label>
            </div>
            <div class="flex items-center mb-2">
              <input
                type="radio"
                name="difa"
                value=""
                id="916"
                className="w-4 h-4"
              />
              <label
                htmlFor="916"
                class="ms-2 text-sm font-medium text-thirdColor"
              >
                9:16
              </label>
            </div>
            <div class="flex items-center mb-2">
              <input
                type="radio"
                name="difa"
                value=""
                id="219"
                className="w-4 h-4"
              />
              <label
                htmlFor="219"
                class="ms-2 text-sm font-medium text-thirdColor"
              >
                21:9
              </label>
            </div>
          </div>
        </div>

        <div className="w-full h-full relative">
          <div className="absolute bottom-0 w-full h-auto border border-acsentColor rounded-md mb-5 p-3">
            <p className="text-xs text-acsentColor mb-2">About</p>
            <p className="text-xs text-thirdColor">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro,
              in.
            </p>
            <p className="text-xs text-thirdColor mt-2">
              Crafted by Nornetics, &copy;2023
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
