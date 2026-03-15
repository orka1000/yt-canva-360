import { useMemo, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  BackgroundVariant,
  useNodesState,
  applyNodeChanges,
  type NodeChange,
  type NodeTypes
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BookmarkNode from './BookmarkNode';
import SectionHeader from './SectionHeader';
import type { Bookmark, CanvasNodeType } from './BookmarkNode';

interface CanvasProps {
  bookmarks: Bookmark[];
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  children?: React.ReactNode;
}

const nodeTypes: NodeTypes = {
  bookmarkNode: BookmarkNode,
  header: SectionHeader,
};

const Canvas: React.FC<CanvasProps> = ({ bookmarks, updateBookmark }) => {
  // Map bookmarks to React Flow nodes
  const initialNodes: CanvasNodeType[] = useMemo(() => 
    bookmarks.map((b) => ({
      id: b.id,
      type: b.type === 'header' ? 'header' : 'bookmarkNode',
      position: { x: b.x, y: b.y },
      data: b,
    })), [bookmarks]);

  const [nodes, setNodes] = useNodesState<CanvasNodeType>(initialNodes);

  // Sync internal nodes with props if bookmarks change externally
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => 
        applyNodeChanges<CanvasNodeType>(changes as NodeChange<CanvasNodeType>[], nds)
      );
      
      // Persist coordinate changes
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && 'id' in change) {
          updateBookmark(change.id, {
            x: change.position.x,
            y: change.position.y,
          });
        }
      });
    },
    [setNodes, updateBookmark]
  );

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        colorMode="dark"
        minZoom={0.01}
        maxZoom={10}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={25} 
          size={1} 
          color="rgba(255, 255, 255, 0.07)" 
        />
        <Controls 
          className="glass border-white/10 !bg-transparent !fill-white/70"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
