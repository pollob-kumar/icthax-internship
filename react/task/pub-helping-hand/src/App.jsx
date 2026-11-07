import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import CreateCampaign from './components/CreateCampaign';
import { BeneficiaryDashboard, DonorDashboard, CommitteeDashboard, AdminDashboard } from './components/RoleDashboards';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // null means not logged in
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'create', 'explore'

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (!user) {
      return <Login onLogin={handleLogin} />;
    }

    if (currentView === 'create' && user.role === 'beneficiary') {
      return <CreateCampaign onSubmit={() => setCurrentView('dashboard')} />;
    }

    // Role based dashboard rendering
    switch (user.role) {
      case 'beneficiary':
        return <BeneficiaryDashboard navigateTo={setCurrentView} />;
      case 'donor':
        return <DonorDashboard />;
      case 'committee':
        return <CommitteeDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-slate-900 text-slate-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="text-xl font-bold tracking-tight text-emerald-400 cursor-pointer"
            onClick={() => setCurrentView('dashboard')}
          >
            PUB Helping Hand
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                Logged in as: <span className="font-semibold text-white">{user.name}</span>
              </span>
              <button onClick={handleLogout} className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;