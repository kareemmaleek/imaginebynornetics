import React, { useEffect, useState, useRef } from "react";
import { IconX, IconZoomIn, IconZoomOut, IconRefresh } from "@tabler/icons-react";

/**
 * Advanced Image Zoom overlay with scale and pan support.
 */
function ImageZoom({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragged(false);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setDragged(true);
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  const toggleZoom = () => {
    if (scale === 1) {
      setScale(2);
    }
    // Zoom out is handled exclusively by buttons/reset to avoid confusion during dragging
  };

  const getCursorClass = () => {
    if (scale > 1) {
      return isDragging ? "cursor-grabbing" : "cursor-grab";
    }
    return "cursor-zoom-in";
  };

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Controls */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 p-2 md:p-3 bg-secondaryColor/80 backdrop-blur-md rounded-full border border-acsentColor/20 z-10 shadow-2xl">
        <button 
          onClick={handleZoomOut} 
          className="p-3 md:p-2 text-thirdColor hover:text-acsentColor active:scale-90 transition-transform" 
          title="Zoom Out"
        >
          <IconZoomOut size={24} className="md:w-[20px] md:h-[20px]" />
        </button>
        <div className="text-[10px] md:text-xs font-bold text-acsentColor min-w-[35px] md:min-w-[40px] text-center">
          {Math.round(scale * 100)}%
        </div>
        <button 
          onClick={handleZoomIn} 
          className="p-3 md:p-2 text-thirdColor hover:text-acsentColor active:scale-90 transition-transform" 
          title="Zoom In"
        >
          <IconZoomIn size={24} className="md:w-[20px] md:h-[20px]" />
        </button>
        <button 
          onClick={handleReset} 
          className="p-3 md:p-2 text-thirdColor hover:text-acsentColor border-l border-acsentColor/10 active:scale-90 transition-transform" 
          title="Reset"
        >
          <IconRefresh size={24} className="md:w-[20px] md:h-[20px]" />
        </button>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-5 md:right-5 z-10 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-secondaryColor/80 hover:bg-red-500/30 text-thirdColor hover:text-red-400 transition-colors border border-acsentColor/20 shadow-xl"
      >
        <IconX size={24} className="md:w-[18px] md:h-[18px]" />
      </button>

      <div 
        className={`relative transition-transform duration-200 ease-out ${getCursorClass()}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (!dragged) toggleZoom();
        }}
        onWheel={handleWheel}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt || "Zoom"}
          draggable={false}
          className="max-w-[95vw] max-h-[90vh] md:max-w-[90vw] md:max-h-[85vh] object-contain rounded-sm shadow-2xl pointer-events-auto"
        />
      </div>
    </div>
  );
}

export default ImageZoom;
