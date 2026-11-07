import React from 'react';

const Header = () => {
  return (
    <header className="bg-slate-900 text-slate-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight text-emerald-400">
          PUB Helping Hand
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-emerald-400 transition-colors">Campaigns</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Emergency Fund</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Donor Dashboard</a>
        </nav>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default Header;