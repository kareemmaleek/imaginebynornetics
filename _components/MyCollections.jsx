import Image from "next/image";
import React from "react";

function MyCollections() {
  return (
    <>
      <div className="w-full h-screen p-10 overflow-y-auto">
        {[...Array(3)].map((i, x) => {
          return (
            <div key={i} className="w-full h-auto mb-5">
              <h2 className="text-xl font-bold mb-3">June, 2024</h2>
              <div className="w-full h-auto flex flex-wrap">
                {[...Array(10)].map((i, x) => {
                  return (
                    //   <Image
                    //     key={x}
                    //     src={`/assets/images/ai/${x + 1}.png`}
                    //     layout="fill"
                    //     objectFit="contain"
                    //     className="rounded-lg"
                    //   />
                    <img
                      key={i}
                      src={`/assets/images/ai/${x + 1}.png`}
                      alt=""
                      width={150}
                      className="object-cover rounded-lg m-1 hover:scale-95 cursor-pointer hover:shadow-inner shadow-md duration-300"
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default MyCollections;
