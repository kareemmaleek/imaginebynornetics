import React, { useState } from "react";
import { IconLogin, IconRotateClockwise } from "@tabler/icons-react";
import { useAuth } from "@/common/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loginProgress, setLoginProgress] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const loginProcess = async () => {
    if (!email || !pwd) {
      return Toastify({
        text: "Email and password are required",
        duration: 3000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibn-error",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
        },
      }).showToast();
    }

    setLoginProgress(true);

    try {
      const response = await axios.post("/api/users/login", {
        email,
        pwd,
      });

      if (response.data.error === 1) {
        Toastify({
          text: response.data.message,
          duration: 3000,
          close: true,
          position: "center",
          stopOnFocus: true,
          className: "ibn-error",
          style: {
            background:
              "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
          },
        }).showToast();
        setLoginProgress(false);
        return;
      }

      // Save token and user data
      login(response.data.token, response.data.user);

      Toastify({
        text: "Login successful! Redirecting...",
        duration: 2000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibn-success",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(24,138,141,1) 11.2%, rgba(96,221,142,1) 91.1%)",
        },
        callback: function () {
          router.push("/");
        },
      }).showToast();
    } catch (error) {
      Toastify({
        text: "Server error, please try again",
        duration: 3000,
        close: true,
        position: "center",
        stopOnFocus: true,
        className: "ibn-error",
        style: {
          background:
            "linear-gradient(109.6deg, rgba(217, 67, 67, 1) 11.2%, rgba(242, 106, 75, 1) 100.6%)",
        },
      }).showToast();
      setLoginProgress(false);
    }
  };

  return (
    <>
      <p className="text-sm italic mb-5">
        Sign in using email and password to access creator panel
      </p>
      <div className="w-full h-auto mb-5">
        <label
          htmlFor="email-log"
          className="font-bold text-thirdColor text-sm"
        >
          Email
        </label>
        <input
          type="text"
          id="email-log"
          placeholder="Email address"
          className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor/20 focus:ring-acsentColor/20"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-full h-auto mb-5">
        <label htmlFor="pwd-log" className="font-bold text-thirdColor text-sm">
          Password
        </label>
        <input
          type="password"
          id="pwd-log"
          placeholder="Enter your password"
          className="p-3 mt-1 w-full text-sm rounded-lg bg-mainColor text-acsentColor shadow-inner appearance-none outline-none ring-1 ring-transparent duration-200 hover:ring-acsentColor/20 focus:ring-acsentColor/20"
          onChange={(e) => setPwd(e.target.value)}
        />
      </div>

      {loginProgress ? (
        <>
          <IconRotateClockwise
            className="animate-spin inline-block mr-2"
            size={18}
          />{" "}
          <span className="text-sm">Sign In Progress...</span>
        </>
      ) : (
        <button
          onClick={() => loginProcess()}
          className="w-full h-auto p-2 text-sm rounded-lg border bg-acsentColor/10 border-acsentColor/20 text-thirdColor hover:bg-acsentBtn hover:text-acsentColor hover:font-semibold"
        >
          Sign In <IconLogin className="inline-block ml-2" size={18} />
        </button>
      )}
    </>
  );
}

export default Login;
