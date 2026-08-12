import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success" | "warning" | "info";
  duration?: number;
  onClose: () => void;
  onClickAction?: () => void;
  actionLabel?: string;
}

export default function Toast({
  message,
  type = "error",
  duration = 5000,
  onClose,
  onClickAction,
  actionLabel,
}: ToastProps) {
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
    info: "bg-sky-600 dark:bg-sky-700 shadow-sky-500/20 hover:bg-sky-700 transition-colors",
  };

  const icons = {
    error: "✕",
    success: "✓",
    warning: "⚠",
    info: "✨",
  };

  const handleClick = () => {
    if (onClickAction) {
      onClickAction();
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={onClickAction ? handleClick : undefined}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg text-white transition-all duration-300 ${
        onClickAction ? "cursor-pointer select-none" : ""
      } ${colors[type]} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-medium">{message}</span>
        {actionLabel && (
          <span className="text-xs font-semibold underline underline-offset-2 opacity-90 mt-0.5">
            {actionLabel}
          </span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer text-lg leading-none p-1"
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

