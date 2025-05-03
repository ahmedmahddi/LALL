"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface ImageGalleryProps {
  images: number[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    if (selectedImage === null) return;
    const currentIndex = images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const goToPrevious = () => {
    if (selectedImage === null) return;
    const currentIndex = images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(imageId => (
          <div
            key={imageId}
            className="aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => openLightbox(imageId)}
          >
            <img
              src={`/assets/${imageId}.jpeg`}
              alt={`Gallery image ${imageId}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
                onClick={closeLightbox}
              >
                ✕
              </button>

              {/* Previous button */}
              <button
                className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
                onClick={e => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                ←
              </button>

              {/* Next button */}
              <button
                className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
                onClick={e => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                →
              </button>

              {/* Image */}
              <img
                src={`../assets/${selectedImage}.jpeg`}
                alt={`Full size image ${selectedImage}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
