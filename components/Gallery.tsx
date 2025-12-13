import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ArrowUpRight, X, Download } from "lucide-react";

type ImageItem = {
  id: number;
  title: string;
  url: string;
  created_at: string;
};

export default function Gallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching gallery:", error);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    }
    fetchImages();
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F0ED] text-[#1C1B1F] selection:bg-[#FF3B30] selection:text-white pt-32 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-[96vw] mx-auto">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-[#1C1B1F] uppercase mb-8">
            Visual
            <br />
            <span className="text-[#FF3B30]">Archive</span>
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1C1B1F]/10 pb-6 gap-4">
            <p className="max-w-md text-xl text-[#49454F] font-medium leading-relaxed">
              A collection of visual experiments, work in progress, and
              snapshots from the studio.
            </p>
            <span className="font-mono text-sm text-[#1C1B1F]/60 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#1C1B1F]/10">
              {loading ? "Syncing..." : `Index: ${images.length}`}
            </span>
          </div>
        </motion.div>

        {/* --- Masonry Grid --- */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 text-[#FF3B30] animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-[#1C1B1F]/10 rounded-[3rem]">
            <p className="text-[#1C1B1F]/40 font-mono uppercase tracking-widest">
              Archive is currently empty.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="break-inside-avoid group relative cursor-zoom-in"
                onClick={() => setSelectedImage(img)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-sm border border-[#E0E0E0] transform transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl">
                  {/* layoutId connects this image to the modal image for smooth morphing */}
                  <motion.img
                    layoutId={`image-${img.id}`}
                    src={img.url}
                    alt={img.title}
                    className="w-full h-auto object-cover block"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out w-full flex justify-between items-end">
                      <p className="text-[#F2F0ED] font-bold text-xl tracking-tight leading-none">
                        {img.title}
                      </p>
                      <div className="bg-white text-[#FF3B30] rounded-full p-2">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Metadata */}
                <div className="mt-4 flex justify-between items-center px-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-mono text-[#1C1B1F] uppercase tracking-widest">
                    {new Date(img.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text-xs font-bold text-[#FF3B30] font-mono">
                    ID_{img.id.toString().padStart(3, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- Image Viewer Modal --- */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1B1F]/90 backdrop-blur-md p-4 md:p-12 cursor-zoom-out"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>

              <div
                className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center pointer-events-none"
                onClick={(e) => e.stopPropagation()} // Prevent clicking content from closing modal
              >
                <motion.img
                  layoutId={`image-${selectedImage.id}`}
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-h-[85vh] w-auto max-w-full rounded-[1rem] shadow-2xl object-contain pointer-events-auto"
                />

                {/* Modal Footer/Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-4 md:bottom-0 left-0 right-0 flex justify-between items-end pointer-events-auto px-4"
                >
                  <div className="text-white">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
                      {selectedImage.title}
                    </h2>
                    <p className="font-mono text-white/60 text-sm uppercase tracking-widest">
                      ID_{selectedImage.id.toString().padStart(3, "0")} •{" "}
                      {new Date(selectedImage.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          dateStyle: "long",
                        }
                      )}
                    </p>
                  </div>

                  <a
                    href={selectedImage.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF3B30] hover:bg-[#D62F25] text-white rounded-full font-medium transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={18} />
                    <span className="hidden md:inline">Save Asset</span>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
