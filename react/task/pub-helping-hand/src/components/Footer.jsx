import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PUB Helping Hand - Blockchain-Based Transparent Fundraising.</p>
        <p className="mt-1">Ensuring smart contract security and transparent donations.</p>
      </div>
    </footer>
  );
};

export default Footer;