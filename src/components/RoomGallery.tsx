import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    setCurrent(emblaApi.selectedScrollSnap() - 1 < 0 ? images.length - 1 : emblaApi.selectedScrollSnap() - 1);
  }, [emblaApi, images.length]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    // Update index after scroll
    setTimeout(() => setCurrent(emblaApi.selectedScrollSnap()), 0);
  }, [emblaApi]);

  const handlePrev = () => {
    scrollPrev();
    setTimeout(() => emblaApi && setCurrent(emblaApi.selectedScrollSnap()), 50);
  };
  const handleNext = () => {
    scrollNext();
    setTimeout(() => emblaApi && setCurrent(emblaApi.selectedScrollSnap()), 50);
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="relative group overflow-hidden">
        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div key={i} className="relative flex-[0_0_100%] min-w-0 h-56 cursor-zoom-in" onClick={() => openLightbox(i)}>
                <img
                  src={src}
                  alt={`${roomName} view ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Zoom hint */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <ZoomIn size={12} className="text-aura-cream/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-aura-cream/70 hover:text-aura-gold hover:border-aura-gold/40 transition-colors opacity-0 group-hover:opacity-100 z-10"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-aura-cream/70 hover:text-aura-gold hover:border-aura-gold/40 transition-colors opacity-0 group-hover:opacity-100 z-10"
        >
          <ChevronRight size={14} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { emblaApi?.scrollTo(i); setCurrent(i); }}
              className={`transition-all duration-300 rounded-full ${i === current ? 'w-5 h-1.5 bg-aura-gold' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Photo count chip */}
        <div className="absolute bottom-3 right-3 font-syne text-[8px] tracking-[2px] bg-black/50 backdrop-blur-sm border border-white/10 px-2 py-1 text-aura-cream/60 z-10">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={images[lightboxIndex]}
              alt={roomName}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close */}
            <button
              className="absolute top-6 right-6 w-10 h-10 border border-aura-cream/20 flex items-center justify-center text-aura-cream/60 hover:text-aura-cream hover:border-aura-gold/40 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={16} />
            </button>

            {/* Lightbox prev/next */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-aura-cream/20 flex items-center justify-center text-aura-cream/60 hover:text-aura-gold transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 border border-aura-cream/20 flex items-center justify-center text-aura-cream/60 hover:text-aura-gold transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-14 h-10 overflow-hidden border transition-all ${i === lightboxIndex ? 'border-aura-gold' : 'border-white/10 opacity-50 hover:opacity-80'}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
