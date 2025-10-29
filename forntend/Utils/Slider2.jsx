import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageSlider = ({ photos = [] }) => {
  const [index, setIndex] = useState(0);

  // ✅ Auto slide every 4s
  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) return null;

  const nextSlide = () => setIndex((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-md">
        <AnimatePresence mode="wait">
          <motion.img
            key={photos[index]?.url}
            src={photos[index]?.url}
            alt={`Product ${index + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-80 object-cover"
          />
        </AnimatePresence>

        {/* Left & Right buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-3 gap-2 flex-wrap">
        {photos.map((photo, i) => (
          <div
            key={photo.id || i}
            onClick={() => setIndex(i)}
            className={`cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-300 ${
              index === i ? "border-blue-500" : "border-transparent"
            }`}
          >
            <img
              src={photo.url}
              alt={`Thumbnail ${i + 1}`}
              className={`w-16 h-16 object-cover ${
                index === i ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
