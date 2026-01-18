import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'setup', label: 'My folders' },
    { id: 'calendar', label: 'Calender' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-serif tracking-wide text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Minerva
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                  currentView === item.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side - Log In */}
          {/* <button className="px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-full transition-all">
            Log In
          </button> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {children}
        </div>

        {/* Footer Logo */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <h2 className="text-xl font-serif tracking-wide text-gray-400" style={{ fontFamily: 'Playfair Display, serif' }}>
            Minerva
          </h2>
        </div>
      </main>
    </div>
  );
};