import React from "react";
import { Compare } from "./ui/compare";

function SampleOutput() {
  const sampleItems = [
    {
      key: 1,
      heading: "Increase Image Quality, Size, and Resolution",
      firstImage: "/compareImage/HouseBlur.png",
      secondImage: "/compareImage/HouseClear.png",
      paragraph:
        "Convert low-resolution images to high-resolution images instantly with a single click. Our AI upscaler automatically enlarges images without making your image become pixelated or blurry. Whether you&rsquo;re getting images ready for print or the web, you&rsquo;ll have sharp, clear results instantly. No download or technical knowledge necessary. Simply upload your image in JPG, PNG, or JPEG and instantly increase your image&rsquo;s quality, size, and resolution.",
    },
    {
      key: 2,
      heading: "Works on Any kind of Image",
      firstImage: "/compareImage/personBlur.jpg",
      secondImage: "/compareImage/personClear.jpg",
      paragraph:
        "Photo Elevate lets your upscale your images while giving them an expressive touch. Not only does it increase resolution but it also let&rsquo;s the AI creatively add new details and visual character. You have the ability to adjust Creativity and Resemblance to make your image more artistic or to stay closer to the original. Upscale creatively in seconds, all in your browser.",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center text-left gap-y-4 px-4">
      <div className="max-w-7xl lg:flex-col lg:items-center">
        {sampleItems.map((item) => (
          <div key={item.key} className={`mb-5 lg:flex ${item.key % 2 == 0 ? "lg:flex-row-reverse" : "lg:flex-row"} lg:justify-between lg:gap-x-4`}>
            <div className="lg:flex lg:flex-col lg:justify-center">
              {/* heading */}
              <h1 className="text-3xl tracking-wide font-bold text-left mb-5">
                {item.heading}
              </h1>
              {/* paragraph */}
              <p className="text-gray-400 hidden lg:flex">{item.paragraph}</p>

              {/* compare */}
              <div className="flex justify-center lg:hidden">
                <Compare
                  firstImage={item.firstImage}
                  secondImage={item.secondImage}
                  firstImageClassName="object-cover object-left-top"
                  secondImageClassname="object-cover object-left-top"
                  className="mb-5"
                />
              </div>
            </div>

            <p className="text-gray-400 lg:hidden">{item.paragraph}</p>

            {/* compare 2 */}
            <div className="hidden lg:flex justify-center">
              <Compare
                firstImage={item.firstImage}
                secondImage={item.secondImage}
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="mb-5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SampleOutput;
