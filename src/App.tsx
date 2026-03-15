import { useState, useCallback } from 'react';
import Canvas from './components/Canvas';
import type { Bookmark } from './components/BookmarkNode';
import { Import, Sparkles, Youtube, Layers, Search, Settings as SettingsIcon } from 'lucide-react';
import { importBookmarks, parseBookmarksHtml } from './services/bookmarkService';
import { organizeBookmarksAI } from './services/aiService';
import { calculateGridLayout } from './services/layoutService';

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const handleImport = async () => {
    const imported = await importBookmarks();
    if (imported.length > 0) {
      setBookmarks(prev => [...prev, ...imported]);
    } else {
      // Trigger file picker if no chrome API or no bookmarks found via API
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.html';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const fileImported = await parseBookmarksHtml(file);
          setBookmarks(prev => [...prev, ...fileImported]);
        }
      };
      input.click();
    }
  };

  const handleAIOrganize = async () => {
    if (bookmarks.length === 0) return;
    const categorized = await organizeBookmarksAI(bookmarks);
    const organized = calculateGridLayout(categorized);
    setBookmarks(organized);
  };

  const handleGridLayout = () => {
    if (bookmarks.length === 0) return;
    const organized = calculateGridLayout(bookmarks);
    setBookmarks(organized);
  };

  return (
    <main className="w-full h-screen overflow-hidden flex flex-col bg-background">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Youtube className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white/90">YT CANVA</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">360 Bookmark Ecosystem</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search bookmarks..." 
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 w-64 transition-all focus:w-80"
            />
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2" />

          <button 
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <Import className="w-3.5 h-3.5" />
            Import Bookmarks
          </button>

          <button 
            onClick={handleAIOrganize}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            AI Organize
          </button>
          
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Floating Toolbar */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50 p-2 glass rounded-2xl">
        <button 
          onClick={handleGridLayout}
          className="p-3 bg-white/10 rounded-xl text-white shadow-lg group relative"
          title="Grid Layout"
        >
          <Layers className="w-5 h-5" />
          <span className="absolute left-full ml-4 px-2 py-1 bg-black/80 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Grid Layout</span>
        </button>
        <button className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all"><Youtube className="w-5 h-5" /></button>
        <button 
          onClick={handleAIOrganize}
          className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all group relative"
          title="AI Organize"
        >
          <Sparkles className="w-5 h-5" />
          <span className="absolute left-full ml-4 px-2 py-1 bg-black/80 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Organize</span>
        </button>
      </nav>

      {/* Main Canva */}
      <Canvas bookmarks={bookmarks} updateBookmark={updateBookmark} />
    </main>
  );
}

export default App;
