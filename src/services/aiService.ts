import type { Bookmark } from '../components/BookmarkNode';

export interface CategoryGroup {
  name: string;
  bookmarks: string[]; // IDs
}

export const organizeBookmarksAI = async (bookmarks: Bookmark[]): Promise<Bookmark[]> => {
  // In a real implementation, we would call an LLM (Gemini) here.
  // For now, we'll simulate AI categorization based on keywords.
  
  const categories = ['Tech', 'Design', 'Music', 'Education', 'Other'];
  
  return bookmarks.map((b) => {
    let category = 'Other';
    const title = b.title.toLowerCase();
    
    if (title.includes('react') || title.includes('frontend') || title.includes('dev') || title.includes('code')) {
      category = 'Tech';
    } else if (title.includes('design') || title.includes('ui') || title.includes('ux') || title.includes('minimal')) {
      category = 'Design';
    } else if (title.includes('music') || title.includes('lofi') || title.includes('mix')) {
      category = 'Music';
    }
    
    // Spatial organization: Group by category
    const categoryIndex = categories.indexOf(category);
    const angle = (categoryIndex / categories.length) * 2 * Math.PI;
    const radius = 600;
    
    const targetX = 5000 + Math.cos(angle) * radius + (Math.random() - 0.5) * 200;
    const targetY = 5000 + Math.sin(angle) * radius + (Math.random() - 0.5) * 200;
    
    return {
      ...b,
      category,
      x: targetX,
      y: targetY
    };
  });
};
