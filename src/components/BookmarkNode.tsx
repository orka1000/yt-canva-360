import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MoreVertical, PlayCircle } from 'lucide-react';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category?: string;
  channel?: string;
  x: number;
  y: number;
  date: number;
}

interface BookmarkNodeProps {
  bookmark: Bookmark;
  onUpdate: (id: string, updates: Partial<Bookmark>) => void;
  currentScale?: number;
}

const BookmarkNode: React.FC<BookmarkNodeProps> = ({ bookmark, onUpdate, currentScale = 1 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isFar = currentScale < 0.4;
  const isGalaxy = currentScale < 0.15;

  return (
    <motion.div
      layout={!isFar} // Disable layout animations when far to save CPU
      drag={!isFar}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onUpdate(bookmark.id, {
          x: bookmark.x + info.offset.x,
          y: bookmark.y + info.offset.y
        });
      }}
      style={{ x: bookmark.x, y: bookmark.y }}
      className="absolute group top-0 left-0"
    >
      {isGalaxy ? (
        <div className="w-12 h-12 bg-white/20 rounded-full blur-[2px] transition-all group-hover:bg-primary/50 group-hover:blur-0" title={bookmark.title} />
      ) : (
        <div className={`glass rounded-xl overflow-hidden transition-all duration-300 ${isFar ? 'w-48' : 'w-72 shadow-lg'} group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:border-white/20`}>
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden bg-white/5">
            {!isFar && (
              <>
                {!imgLoaded && <div className="absolute inset-0 shimmer" />}
                <img 
                  src={bookmark.thumbnail || `https://img.youtube.com/vi/${extractVideoIdInternal(bookmark.url)}/maxresdefault.jpg`} 
                  alt={bookmark.title}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            )}
            <div className={`absolute inset-0 bg-black/40 ${isFar ? '' : 'opacity-0'} group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
              {isFar ? <div className="text-[8px] p-2 text-white/50 text-center line-clamp-2">{bookmark.title}</div> : <PlayCircle className="w-12 h-12 text-white/80" />}
            </div>
            {bookmark.category && !isFar && (
              <div className="absolute top-2 left-2 px-2 py-1 glass rounded text-[10px] uppercase tracking-wider font-bold text-white/70">
                {bookmark.category}
              </div>
            )}
          </div>
          
          {/* Content */}
          {!isFar && (
            <div className="p-3 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-semibold line-clamp-2 text-foreground/90 leading-tight group-hover:text-white transition-colors">
                  {bookmark.title}
                </h3>
                <button className="text-muted-foreground hover:text-white shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {bookmark.channel || 'YouTube Video'}
                </span>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-white"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const extractVideoIdInternal = (url: string) => {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  } catch {
    return '';
  }
};

export default BookmarkNode;
