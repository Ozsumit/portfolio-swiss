import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { GalleryItem } from '../types';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await storageService.getGallery();
        setImages(data);
      } catch (e) {
        console.error("Failed to load gallery", e);
      } finally {
        setLoading(false);
      }
    };
    loadImages();

    // Cleanup URLs to avoid memory leaks
    return () => {
      images.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-m3-surface animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-[96vw] mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-m3-on-surface uppercase mb-8">
            Visual<br/><span className="text-swiss-red">Archive</span>
          </h1>
          <div className="flex justify-between items-end border-b border-m3-on-surface/10 pb-6">
             <p className="max-w-md text-xl text-m3-on-surface-variant font-medium">
               A collection of visual experiments, work in progress, and snapshots from the studio.
             </p>
             <span className="font-mono text-sm text-m3-secondary">
               {loading ? 'Loading...' : `${images.length} Items`}
             </span>
          </div>
        </div>

        {/* Masonry Grid */}
        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-swiss-red border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-m3-on-surface/20 rounded-[3rem]">
            <p className="text-m3-secondary font-mono">Archive is currently empty.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((item) => (
              <div key={item.id} className="break-inside-avoid group relative">
                <div className="relative overflow-hidden rounded-[2rem] bg-m3-secondary-container">
                  <img 
                    src={item.url} 
                    alt={item.caption}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                     <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                       {item.caption}
                     </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="text-xs font-mono text-m3-secondary uppercase">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="text-xs font-bold text-swiss-red">00{item.id.slice(0,2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;