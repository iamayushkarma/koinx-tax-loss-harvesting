import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({ children, content, position = "bottom" }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // arrow direction based on position
  const arrowClass: Record<string, string> = {
    bottom:
      "bottom-full left-1/2 -translate-x-1/2  border-b-white/90 border-l-transparent border-r-transparent border-t-transparent border-8",
    top: "top-full left-1/2 -translate-x-1/2 mt-1 border-t-white/90 border-l-transparent border-r-transparent border-b-transparent border-8",
    left: "left-full top-1/2 -translate-y-1/2 ml-1 border-l-white/90 border-t-transparent border-b-transparent border-r-transparent border-8",
    right:
      "right-full top-1/2 -translate-y-1/2 mr-1 border-r-white/90 border-t-transparent border-b-transparent border-l-transparent border-8",
  };

  // tooltip box position
  const boxClass: Record<string, string> = {
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  return (
    <div
      ref={ref}
      className="relative inline-block "
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {/* trigger */}
      <div className="cursor-pointer">{children}</div>

      {/* tooltip box */}
      {open && (
        <div
          className={`
      fixed left-4 right-4 z-50 max-sm:mt-2 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 text-sm leading-relaxed
      sm:absolute sm:left-auto sm:right-auto sm:w-max sm:max-w-xs ${boxClass[
        position
      ]
        .split(" ")
        .map((c) => `sm:${c}`)
        .join(" ")}
    `}
        >
          <span
            className={`hidden sm:absolute w-0 h-0 ${arrowClass[position]}`}
          />
          {/* close button only on mobile since there's no hover to dismiss */}

          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
