import type { Bookmark } from '../components/BookmarkNode';

interface LayoutOptions {
  groupBy?: 'category' | 'date';
  originX?: number;
  originY?: number;
}

/**
 * Calculates a neat grid layout for a set of bookmarks.
 * Each group (Category or Date) starts in its own new set of columns (a Lane).
 * This creates a clear horizontal separation between different days/topics.
 */
export const calculateGridLayout = (bookmarks: Bookmark[], options: LayoutOptions = {}): Bookmark[] => {
  const {
    groupBy = 'category',
    originX = 5000,
    originY = 5000,
  } = options;

  // 1. Group items
  const groups: Record<string, Bookmark[]> = {};
  bookmarks.forEach((b) => {
    if (b.type === 'header') return;

    let key = 'Other';
    if (groupBy === 'category') {
      key = b.category || 'Other';
    } else if (groupBy === 'date') {
      const date = new Date(b.date);
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  });

  const sortedKeys = Object.keys(groups);
  if (groupBy === 'date') {
    sortedKeys.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  } else {
    sortedKeys.sort();
  }

  // 2. Layout Constants
  const COLUMN_WIDTH = 340; 
  const ROW_HEIGHT = 300;   
  const HEADER_ROW_HEIGHT = 220; 
  const COLS_PER_GROUP = 5;  // For each day, we allow 5 cards horizontally before wrapping
  const GROUP_GAP = 800;     // Large horizontal gap between days/categories

  const result: Bookmark[] = [];
  let currentX = originX;

  // 3. Sequential Group Placement
  sortedKeys.forEach((key) => {
    const groupItems = groups[key].sort((a, b) => b.date - a.date);
    
    // Inject Header at the start of the new group's column
    result.push({
      id: `header-${key}-${Date.now()}-${Math.random()}`,
      type: 'header',
      label: key,
      title: key,
      url: '',
      thumbnail: '',
      date: Date.now(),
      x: currentX,
      y: originY
    });

    // Place group items in a grid starting below the header
    groupItems.forEach((item, index) => {
      const col = index % COLS_PER_GROUP;
      const row = Math.floor(index / COLS_PER_GROUP);

      result.push({
        ...item,
        x: currentX + col * COLUMN_WIDTH,
        y: originY + HEADER_ROW_HEIGHT + row * ROW_HEIGHT,
      });
    });

    // Move currentX to the next group's starting position
    // Width of this group + group gap
    currentX += (COLS_PER_GROUP * COLUMN_WIDTH) + GROUP_GAP;
  });

  return result;
};
