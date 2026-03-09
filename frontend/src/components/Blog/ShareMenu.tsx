import { useState, useEffect, useRef } from "react";
import { BiShareAlt, BiCopy, BiCheck } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

interface ShareMenuProps {
  postId: string;
  postTitle: string;
}

export default function ShareMenu({ postId, postTitle }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const shareUrl = `${window.location.origin}/post/${postId}`;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = `${postTitle} — ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 cursor-pointer"
        title="Compartilhar"
      >
        <BiShareAlt className="text-lg" />
        Compartilhar
      </button>

      {isOpen && (
        <div
          className="share-overlay"
          onClick={handleOverlayClick}
        >
          <div ref={modalRef} className="share-modal">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Compartilhar</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-5 mb-6">
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                title="Compartilhar no WhatsApp"
              >
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-200">
                  <FaWhatsapp />
                </div>
                <span className="text-xs text-gray-600 font-medium">WhatsApp</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 group cursor-pointer"
                title="Copiar link"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-all duration-200 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {copied ? <BiCheck /> : <BiCopy />}
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {copied ? "Copiado!" : "Copiar link"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3">
              <span className="flex-1 text-sm text-gray-600 truncate select-all">
                {shareUrl}
              </span>
              <button
                onClick={handleCopy}
                className={`shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
