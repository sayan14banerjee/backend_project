import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Flame, Clock, ThumbsUp, BookmarkSquare, Menu } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Flame, label: 'Trending', href: '/trending' },
  ];

  const authenticatedItems = [
    { icon: Clock, label: 'Watch Later', href: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', href: '/liked' },
    { icon: BookmarkSquare, label: 'Playlists', href: '/playlists' },
  ];

  const allItems = user ? [...menuItems, ...authenticatedItems] : menuItems;

  const MenuContent = () => (
    <div className="space-y-2 p-4">
      <h3 className="text-muted-foreground text-sm font-semibold mb-4">Menu</h3>
      {allItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition text-foreground font-medium"
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-card border-r border-muted sticky top-16 overflow-y-auto">
        <MenuContent />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={onClose}
          />
          <div className="fixed left-0 top-16 w-64 h-screen bg-card border-r border-muted z-40 overflow-y-auto">
            <MenuContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
