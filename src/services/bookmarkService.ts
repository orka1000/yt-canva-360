/// <reference types="chrome" />

import type { Bookmark } from '../components/BookmarkNode';

export const importBookmarks = async (): Promise<Bookmark[]> => {
  if (typeof chrome !== 'undefined' && chrome.bookmarks) {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree((tree) => {
        const youtubeBookmarks: Bookmark[] = [];
        const lastTwoDays = Date.now() - (2 * 24 * 60 * 60 * 1000);
        const traverse = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
          for (const node of nodes) {
            if (node.url && (node.url.includes('youtube.com/watch') || node.url.includes('youtu.be/'))) {
              // Only include bookmarks from the last 2 days
              if (node.dateAdded && node.dateAdded > lastTwoDays) {
                youtubeBookmarks.push({
                  id: node.id,
                  title: node.title,
                  url: node.url,
                  thumbnail: `https://img.youtube.com/vi/${extractVideoId(node.url)}/maxresdefault.jpg`,
                  x: 5000 + (Math.random() - 0.5) * 1000,
                  y: 5000 + (Math.random() - 0.5) * 1000,
                  date: node.dateAdded,
                });
              }
            }
            if (node.children) traverse(node.children);
          }
        };
        traverse(tree);
        resolve(youtubeBookmarks);
      });
    });
  }
  
  // Return empty if no chrome API, so App.tsx can handle file fallback
  return [];
};

export const parseBookmarksHtml = async (file: File): Promise<Bookmark[]> => {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const links = Array.from(doc.querySelectorAll('a'));
  
  const lastTwoDays = Date.now() - (2 * 24 * 60 * 60 * 1000);
  
  return links
    .filter(link => {
      const url = link.getAttribute('href') || '';
      const dateAdded = parseInt(link.getAttribute('add_date') || '0') * 1000; // ADD_DATE is usually in seconds
      return (url.includes('youtube.com/watch') || url.includes('youtu.be/')) && dateAdded > lastTwoDays;
    })
    .map((link, index) => {
      const url = link.getAttribute('href') || '';
      return {
        id: `imported-${index}-${Date.now()}`,
        title: link.textContent || 'Untitled Video',
        url: url,
        thumbnail: `https://img.youtube.com/vi/${extractVideoId(url)}/maxresdefault.jpg`,
        x: 5000 + (Math.random() - 0.5) * 1200,
        y: 5000 + (Math.random() - 0.5) * 1200,
        date: parseInt(link.getAttribute('add_date') || '0') * 1000,
      };
    });
};

const extractVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};
