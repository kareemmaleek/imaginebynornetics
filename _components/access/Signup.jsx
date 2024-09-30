import { Error, HowToReg, RotateRight } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [signProgress, setSignProgress] = useState(false);

  const route = useRouter();

  const signUpProcess = async () => {
    setSignProgress(true);

    await axios
      .post("/api/users/signup", {
        email: email,
        pwd: pwd,
        confirmPwd: confirmPwd,
      })
      .then((response) => {
        console.log(response);

        if (response.data.error === 1) {
          return Toastify({
            text: response.data.message.includes("confirmPwd")
              ? "Password confirmation does not match!"
              : response.data.message,
            duration: 3000,
            close: true,
            position: "center",
            stopOnFocus: true,
            className: "ibn-error",
            style: {
              background:
                "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
            },
            callback: function () {
              setSignProgress(false);
            },
          }).showToast();
        }

        Toastify({
          text: response.data.message + " Sign you in...",
          duration: 3000,
          close: true,
          position: "center",
          stopOnFocus: true,
          escapeMarkup: true,
          className: "ibn-success",
          style: {
            background:
              "linear-gradient( 109.6deg,  rgba(24,138,141,1) 11.2%, rgba(96,221,142,1) 91.1% )",
          },
          callback: function () {
            route.push("/");
          },
        }).showToast();
      })
      .catch((error) => {
        // console.log(error.response.data);
        Toastify({
          text: "ERRSERV CONNECTION, Please Contact DEV",
          duration: 3000,
          close: true,
          position: "center",
          stopOnFocus: true,
          escapeMarkup: true,
          className: "ibn-error",
          style: {
            background:
              "linear-gradient( 109.6deg,  rgba(217,67,67,1) 11.2%, rgba(242,106,75,1) 100.6% )",
          },
          callback: function () {
            setSignProgress(false);
          },
        }).showToast();
      });
  };

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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPwd(e.target.value)}
        />
      </div>

      <div className="w-full h-auto mb-5">
        <label htmlFor="pwd-log" className="font-bold text-thirdColor">
          Confirm Password
        </label>
        <input
          type="password"
          id="cpwd-log"
          placeholder="Confirm your password"
          className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor focus:ring-acsentColor"
          onChange={(e) => setConfirmPwd(e.target.value)}
        />
      </div>

      {signProgress ? (
        <>
          <RotateRight className="animate-spin" /> Sign Up Progress...
        </>
      ) : (
        <button
          onClick={() => signUpProcess()}
          className="w-full h-auto p-1 border border-acsentColor rounded-lg hover:bg-acsentColor/5 hover:text-acsentColor hover:font-bold"
        >
          Sign Up
          <HowToReg />
        </button>
      )}
    </>
  );
}

export default Signup;
