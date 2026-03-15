import { useState, memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { ExternalLink, MoreVertical, PlayCircle } from 'lucide-react';

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category?: string;
  channel?: string;
  x: number;
  y: number;
  date: number;
} & Record<string, unknown>;

export type BookmarkNodeData = Bookmark;

export type BookmarkNodeType = Node<BookmarkNodeData, 'bookmarkNode'>;

const BookmarkNode = ({ data, selected }: NodeProps<BookmarkNodeType>) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  
  // Note: currentScale is now handled by React Flow's viewport
  // We can use the 'selected' prop for extra visual feedback
  
  return (
    <div className={`relative group ${selected ? 'ring-2 ring-primary ring-offset-4 ring-offset-background rounded-xl' : ''}`}>
      {/* Hidden Handles for future connection support */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />

      <div className={`glass rounded-xl overflow-hidden transition-all duration-300 w-72 shadow-lg group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:border-white/20`}>
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-white/5">
          {!imgLoaded && <div className="absolute inset-0 shimmer" />}
          <img 
            src={data.thumbnail || `https://img.youtube.com/vi/${extractVideoIdInternal(data.url)}/maxresdefault.jpg`} 
            alt={data.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/80" />
          </div>
          {data.category && (
            <div className="absolute top-2 left-2 px-2 py-1 glass rounded text-[10px] uppercase tracking-wider font-bold text-white/70">
              {data.category}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-semibold line-clamp-2 text-foreground/90 leading-tight group-hover:text-white transition-colors">
              {data.title}
            </h3>
            <button className="text-muted-foreground hover:text-white shrink-0">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-muted-foreground font-medium">
              {data.channel || 'YouTube Video'}
            </span>
            <a 
              href={data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
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

export default memo(BookmarkNode);
