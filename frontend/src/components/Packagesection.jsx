import React from 'react';
import { ArrowRight } from 'lucide-react';
import img2 from "../assets/img3.jpg";  // Ensure the path is correct

export default function Packagesection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Section (Left Side on Large Screens) */}
          <div className="relative w-full h-80 sm:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden group">
            <img
              src={img2}
              alt="Modern city utilities"
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-transparent to-transparent opacity-30 rounded-2xl"></div>
          </div>
          
          {/* Content Section (Right Side on Large Screens) */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Transforming Utilities for a Modern World
              </h2>
              <p className="text-gray-600 text-2xl">
                At Modern Utilities, we specialize in innovative solutions that enhance your daily life. Our commitment to sustainability and efficiency sets us apart in the utility sector.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">Smart Solutions</h3>
                <p className="text-gray-600 text-lg">
                  Empowering communities with cutting-edge technology and reliable utility services.
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">Sustainable Practices</h3>
                <p className="text-gray-600 text-lg">
                  Dedicated to eco-friendly solutions that benefit both you and the environment.
                </p>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-start gap-4">
            <button className="w-full sm:w-auto py-4 px-8 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold 
                transition duration-300 ease-in-out shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Explore
              </button>
              <button className="w-full sm:w-auto py-4 px-8 text-blue-600 bg-white border-2 border-blue-600 
                hover:bg-blue-50 rounded-lg text-lg font-semibold 
                transition duration-300 ease-in-out shadow-md hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Contact Us
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
