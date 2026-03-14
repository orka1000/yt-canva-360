import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import BookmarkNode from './BookmarkNode';
import type { Bookmark } from './BookmarkNode';

interface CanvasProps {
  bookmarks: Bookmark[];
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  children?: React.ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({ bookmarks, updateBookmark, children }) => {
  const [scale, setScale] = useState(1);
  const [viewport, setViewport] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Update viewport bounds for culling
  const updateViewport = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = x.get();
    const currentY = y.get();
    
    // Calculate the logical coordinates visible in the viewport
    // Taking into account that the canvas is centered at 5000,5000
    const padding = 500 / scale; // Buffer for smooth scrolling
    setViewport({
      x1: 5000 - (currentX + rect.width / 2) / scale - padding,
      y1: 5000 - (currentY + rect.height / 2) / scale - padding,
      x2: 5000 - (currentX - rect.width / 2) / scale + padding,
      y2: 5000 - (currentY - rect.height / 2) / scale + padding,
    });
  }, [x, y, scale]);

  useEffect(() => {
    updateViewport();
    const unsubX = x.on('change', updateViewport);
    const unsubY = y.on('change', updateViewport);
    return () => { unsubX(); unsubY(); };
  }, [updateViewport, x, y]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 5);
      setScale(newScale);
    } else {
      // Pan
      x.set(x.get() - e.deltaX);
      y.set(y.get() - e.deltaY);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background canvas-dot-grid touch-none"
      onWheel={handleWheel}
    >
      <motion.div
        drag
        dragMomentum={false}
        style={{ x, y, scale }}
        className="absolute w-[10000px] h-[10000px] top-1/2 left-1/2 -mt-[5000px] -ml-[5000px] cursor-grab active:cursor-grabbing will-change-transform"
      >
        <div className="relative w-full h-full">
          {bookmarks.map(bookmark => {
            const isVisible = 
              bookmark.x >= viewport.x1 && 
              bookmark.x <= viewport.x2 && 
              bookmark.y >= viewport.y1 && 
              bookmark.y <= viewport.y2;
            
            if (!isVisible) return null;

            return (
              <BookmarkNode 
                key={bookmark.id} 
                bookmark={bookmark} 
                onUpdate={updateBookmark} 
                currentScale={scale}
              />
            );
          })}
          {children}
        </div>
      </motion.div>
      
      {/* UI Overlays */}
      <div className="fixed bottom-6 right-6 flex items-center gap-4 p-2 glass rounded-full px-4 text-xs font-medium text-muted-foreground z-50">
        <span>Zoom: {Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(1)} className="hover:text-foreground transition-colors">Reset</button>
      </div>
    </div>
  );
};

export default Canvas;
