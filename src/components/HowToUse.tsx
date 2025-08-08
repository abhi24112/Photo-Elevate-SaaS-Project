import React from "react";
import { IconArrowBigRightFilled } from "@tabler/icons-react";

function HowToUse() {
  const navItems = [
    {
      key: 1,
      arrow: true,
      heading: "Step 1. Upload Image",
      para: "Select & upload any photo from your device.",
    },
    {
      key: 2,
      arrow: true,
      heading: "Step 2. AI Processing",
      para: "Our tool instantly enhances resolution of Image without quality loss.",
    },
    {
      key: 3,
      arrow: false,
      heading: "Step 3. Download Result",
      para: "Save your enlarged image ready for print or digital use.",
    },
  ];
  return (
    <div className="bg-[#353839] border-[0.5px] border-dashed py-6 lg:py-10 px-6 rounded-2xl ">
      <div className=" text-center">
        <h2 className="text-3xl font-bold text-white mb-10">
          How to Upscale Images in 3 Simple Steps
        </h2>
        <div className="flex flex-col lg:flex-row lg:gap-x-4 justify-center items-center align-middle ">
          {navItems.map((item) => (
            <div
              key={item.key}
              className="space-y-1 flex flex-col lg:flex-row items-center lg:gap-x-4"
            >
              <div className="bg-[#262829] w-[250px] sm:w-[350px] md:w-[450px] rounded-lg p-6 lg:h-[150px] lg:w-[270px]">
                <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {item.heading}
                </h3>
                <p className="text-gray-400 text-sm">{item.para}</p>
              </div>
              <div className="lg:rotate-0 rotate-90">
                {item.arrow && <IconArrowBigRightFilled />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowToUse;
