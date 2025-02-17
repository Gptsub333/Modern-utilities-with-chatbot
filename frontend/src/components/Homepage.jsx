import React, { useEffect } from "react";
import img from "../assets/img.jpg"; // Ensure the path is correct

export default function Homepage() {
  useEffect(() => {
    function LoadChatWidget() {
      const script = document.createElement("script");
      script.defer = true;
      script.src =
        "https://chatbot.agentz.ai/agentz-chatbot.js?version=1&botUrl=https://chatbot.agentz.ai&title=title&businessAgent=a7bc5323-24a6-4714-a088-34a5bbfa6328";
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      setTimeout(() => {
        LoadChatWidget();
      }, 5000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div className="bg-white pt-32 pb-16 md:pt-40 lg:pt-48">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Section */}
          <div className="space-y-8 order-last lg:order-first">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Modern Utilities <br className="hidden sm:block" />
                <span className="text-blue-600">Best Services, Affordable Prices</span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-xl">
                Experience top-notch utility services without breaking the bank. Your one-stop shop for internet, mobile/landline service, and TV!
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <button className="w-full sm:w-auto py-4 px-8 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition duration-300 ease-in-out shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Get Started
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative w-full h-80 sm:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden group">
          <img
            src={img}
            alt="Modern city utilities"
            className="w-full h-full object-cover object-[30%_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-transparent to-transparent opacity-30 rounded-2xl"></div>
        </div>  
        </div>
      </div>

      {/* Agentz Chatbot */}
      {/* <div
        id="agentz-chatbot-a7bc5323-24a6-4714-a088-34a5bbfa6328"
        className="fixed bottom-4 right-4 w-16 h-16 z-50"
      ></div> */}
    </div>
  );
}
