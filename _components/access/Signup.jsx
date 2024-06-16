import { HowToReg } from "@mui/icons-material";
import React from "react";

function Signup() {
  return (
    <>
      <p className="text-sm italic mb-5">
        Sign up using valid email and password to become creator
      </p>
      <div className="w-full h-auto mb-5">
        <label htmlFor="email-log" className="font-bold text-thirdColor">
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

      <div className="w-full h-auto mb-5">
        <label htmlFor="pwd-log" className="font-bold text-thirdColor">
          Confirm Password
        </label>
        <input
          type="password"
          id="pwd-log"
          placeholder="Confirm your password"
          className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
        />
      </div>

      <button className="w-full h-auto p-1 border border-acsentColor rounded-lg hover:bg-acsentColor/5 hover:text-acsentColor hover:font-bold">
        Sign Up <HowToReg />
      </button>
    </>
  );
}

export default Signup;
