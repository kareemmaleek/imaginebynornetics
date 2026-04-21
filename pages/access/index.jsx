import Login from "@/_components/access/Login";
import Signup from "@/_components/access/Signup";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

function index() {
  const [accessOpt, setAccessOpt] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("ibn_token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <div
        className="w-full h-screen "
        style={{
          background: 'url("/assets/images/bg-access.webp")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full flex  flex-col justify-center items-center  p-4 md:p-0 backdrop-blur-sm backdrop-brightness-[25%]">
          <div className="w-full md:w-8/12 lg:w-6/12 h-auto md:h-[500px] rounded-lg bg-secondaryColor shadow-lg flex flex-col md:flex-row">
            <div className="w-full md:w-6/12 h-auto py-10 md:h-full flex justify-center items-center">
              <div className="w-auto h-auto flex flex-col">
                <div className="w-full h-auto flex justify-center items-center mb-3">
                  <img
                    src="./assets/images/logo-ibn.png"
                    alt="imaginebynornetics"
                    width={200}
                  />
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
            imaginebynornetics &copy; 2024, app version v2.0
          </p>
        </div>
      </div>
    </>
  );
}

export default index;
