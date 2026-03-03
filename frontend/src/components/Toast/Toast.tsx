import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "warning";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "error", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    error: "bg-red-600",
    success: "bg-green-600",
    warning: "bg-amber-500",
  };

  const icons = {
    error: "✕",
    success: "✓",
    warning: "⚠",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg text-white transition-all duration-300 ${colors[type]} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
