// src/components/ReviewCarousel.jsx

import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Brite Ang3l",
    review: "Best place in Las Vegas to get Internet phone or cable TV service. I highly recommend speaking with Milan or Tom. Veteran owned and operated small business so I love supporting our soldiers.",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 2,
    name: "Brite Ang3l",
    review: "Milan is a great employee and very helpful. He was able to assist me and everything that I needed. Also the lady that also assisted was an amazing service provider. I think you guys so much and I recommend a lot of people go to the service.",
    rating: 4,
    profession: "Customer"
  },
  {
    id: 3,
    name: "preston howard",
    review: "Man these people are the real deal. I have never had such a business experience in my life. Milan is sent from the heavens. He is a disabled combat Army veteran that fought for this country and put his life on the line.",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 4,
    name: "Harland Lee",
    review: "These guys are the best in the business, I promise you. They have ALL providers at the same location. Ask for Milan or Thom. They have been in the business since internet was invented. They know so much, it is unreal.",
    rating: 4,
    profession: "Customer"
  },
  {
    id: 5,
    name: "tae wells",
    review: "Milan is the Best he’s the 3Cs and the 3Ts cool, calm, collective and on time, task, and target he gets the job done. I never really experienced GREAT CUSTOMER SERVICE until I met him. I highly recommend.",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 6,
    name: "Albert Avila",
    review: "Modern Utilities is where you want to bring your business to, nothing but professionalism and dedication coming from Milan. I brought my questions and concerns to him hoping that I receive the service we as consumers deserve.",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 7,
    name: "S C",
    review: "Milan is amazing! He did an excellent job explaining everything with my elderly mother who is not savvy with technology. I would not hesitate to recommend this place to anyone.",
    rating: 4,
    profession: "Customer"
  },
  {
    id: 8,
    name: "Ryn",
    review: "Milan was awesome, I had a situation and he had me taken care of and on my way in a matter of minutes, and the modem I got worked perfectly. I will go through him for now on for all my CenturyLink needs and issues. Thank you so much.",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 9,
    name: "Scotavo Agostino",
    review: "I lost my internet service due to a thunderstorm. I called Modern Utilities and they were very helpful, especially Milan. I was up and running with a new system in no time. The customer service was excellent. Milan definitely went the extra miles. Thanks for being so helpful.",
    rating: 4,
    profession: "Customer"
  },
  {
    id: 10,
    name: "Marcos Delucas",
    review: "I live in Maryland and needed a solution for internet service for my home and my business. I know this company is based in Las Vegas Nevada but they are licensed in all 50 states. I saw one of his YouTube videos and I was inclined.",
    rating: 3.5,
    profession: "Customer"
  },
  {
    id: 11,
    name: "Mary Agnes Barreras",
    review: "This is by far the best place ever to do business if you need internet service, cable TV, phone (mobile, VoIP, landline, they do it all). They have multiple providers under the same roof but I believe their primary deal with T-mobile",
    rating: 5,
    profession: "Customer"
  },
  {
    id: 12,
    name: "Bev Oskilanec",
    review: "After a very rude phone tech that tried to upsell services to me, I went into the office and spoke with Milan. He was great, went above and beyond for me to get my billing sorted out. I will recommend him to anyone and everyone. Don't sit on the phone with tech yourself, Milan can get it done.",
    rating: 5,
    profession: "Customer"
  },
];

// ReviewCard Component
const ReviewCard = ({ name, review, rating, profession }) => {
  return (
    <div className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-start mb-4 ">
        <Quote className="w-8 h-8 text-blue-400 mr-3 opacity-50" />
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : i < rating ? 'text-yellow-400/50' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 mb-4 italic flex-grow overflow-hidden">
        "{review}"
      </p>
      <div className="flex items-center mt-4">
        <div>
          <p className="font-semibold text-blue-600">{name}</p>
          <p className="text-sm text-gray-500">{profession}</p>
        </div>
      </div>
    </div>
  );
};

// ReviewCarousel Component
export default function ReviewCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
  });

  // Automatically scroll the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimonials
          </h2>
          <p className="text-gray-600 text-2xl max-w-2xl mx-auto">
            Hear from our satisfied customers who have experienced the Modern Utilities difference.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 p-3">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] px-4"
                >
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            className="hidden md:flex absolute left-[-60px] top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-all duration-300"
            onClick={scrollPrev}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            className="hidden md:flex absolute right-[-60px] top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-all duration-300"
            onClick={scrollNext}
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
