import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom"; // IMPORT THIS
import emailjs from "@emailjs/browser";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by waiting for mount
  useEffect(() => {
    setMounted(true);
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // UPDATED: Now using VITE_ prefix
    const serviceId = import.meta.env.VITE_SERVICE_ID;
    const templateId = import.meta.env.VITE_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY;

    if (formRef.current) {
      emailjs.sendForm(serviceId, templateId, formRef.current, publicKey).then(
        () => {
          setStatus("success");
          // Optional: Close after delay
          // setTimeout(() => { onClose(); setStatus("idle"); }, 3000);
        },
        (error) => {
          console.error("FAILED...", error);
          setStatus("error");
        }
      );
    }
  };

  // 1. Don't render anything if not open or not mounted
  if (!isOpen || !mounted) return null;

  // 2. Use createPortal to attach this HTML to the document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop (Dark Overlay) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose} // Clicking outside closes modal
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-m3-surface text-m3-on-surface rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
            <p className="text-m3-on-surface/70 mb-6">
              I'll get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-m3-on-surface text-m3-surface font-bold hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl md:text-3xl font-black mb-2">Let's Talk</h3>
            <p className="text-m3-on-surface/60 mb-6">
              Send me a message and I'll reply ASAP.
            </p>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 ml-1 opacity-50">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-m3-secondary-container/20 border border-transparent focus:bg-white focus:border-swiss-red rounded-xl p-3 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 ml-1 opacity-50">
                  Email
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-m3-secondary-container/20 border border-transparent focus:bg-white focus:border-swiss-red rounded-xl p-3 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 ml-1 opacity-50">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-m3-secondary-container/20 border border-transparent focus:bg-white focus:border-swiss-red rounded-xl p-3 outline-none transition-all resize-none"
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} /> Failed to send. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-m3-on-surface text-m3-surface font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body // This attaches the modal to the very bottom of the HTML <body>
  );
};

export default ContactModal;
