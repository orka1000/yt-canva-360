import type { Bookmark } from '../components/BookmarkNode';

interface LayoutOptions {
  cols?: number;
  spacingX?: number;
  spacingY?: number;
  originX?: number;
  originY?: number;
}

/**
 * Calculates a neat grid layout for a set of bookmarks.
 * Groups by category but distributes them into 5 balanced vertical lanes.
 */
export const calculateGridLayout = (bookmarks: Bookmark[], options: LayoutOptions = {}): Bookmark[] => {
  const {
    originX = 5000,
    originY = 5000,
  } = options;

  // Group by category to keep related videos together
  const groups: Record<string, Bookmark[]> = {};
  bookmarks.forEach((b) => {
    const cat = b.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(b);
  });

  const sortedCategories = Object.keys(groups).sort();
  const allSortedBookmarks: Bookmark[] = [];
  sortedCategories.forEach(cat => allSortedBookmarks.push(...groups[cat]));

  const result: Bookmark[] = [];
  
  const COLUMN_WIDTH = 320; 
  const ROW_HEIGHT = 280;   
  const COLS_PER_LANE = 8; 
  const NUM_LANES = 5;      
  const LANE_GAP = 500;     

  const LANE_WIDTH = COLUMN_WIDTH * COLS_PER_LANE;
  
  // Calculate how many items per lane for balancing
  const itemsPerLane = Math.ceil(allSortedBookmarks.length / NUM_LANES);

  allSortedBookmarks.forEach((b, globalIndex) => {
    // Determine which of the 5 lanes this item belongs to
    const laneIndex = Math.min(Math.floor(globalIndex / itemsPerLane), NUM_LANES - 1);
    // Determine its position within that lane
    const itemInLaneIndex = globalIndex % itemsPerLane;

    const laneBaseX = originX + laneIndex * (LANE_WIDTH + LANE_GAP);
    
    // Within the lane, it's a grid of COLS_PER_LANE width
    const col = itemInLaneIndex % COLS_PER_LANE;
    const row = Math.floor(itemInLaneIndex / COLS_PER_LANE);

    result.push({
      ...b,
      x: laneBaseX + col * COLUMN_WIDTH,
      y: originY + row * ROW_HEIGHT,
    });
  });

  return result;
};
