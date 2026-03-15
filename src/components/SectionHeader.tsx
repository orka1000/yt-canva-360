import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CanvasNodeType } from './BookmarkNode';

const SectionHeader = ({ data }: NodeProps<CanvasNodeType>) => {
  return (
    <div className="px-6 py-10 min-w-[800px] select-none pointer-events-none">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-6">
          <div className="w-2 h-16 bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
          <h2 className="text-6xl font-black text-white uppercase tracking-[-0.05em] whitespace-nowrap italic drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            {data.label}
          </h2>
        </div>
        <div className="w-full h-[2px] bg-gradient-to-r from-red-600 via-white/20 to-transparent mt-4 opacity-50" />
        <p className="text-xs font-black text-white/30 uppercase tracking-[1em] ml-8 mt-2">
          360 Eco-System Workspace
        </p>
      </div>
      
      {/* Hidden handles to keep React Flow happy */}
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
};

export default memo(SectionHeader);
