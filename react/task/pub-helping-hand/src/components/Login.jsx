import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const roles = [
    { id: 'beneficiary', name: 'Campaign Owner / Beneficiary', desc: 'Request campaigns, submit spending requests' },
    { id: 'donor', name: 'Donor', desc: 'Donate, track use of donations, download receipts' },
    { id: 'committee', name: 'Verification Committee', desc: 'Verify campaigns, approve spending' },
    { id: 'admin', name: 'Administrator / Auditor', desc: 'Manage users, view reports & analytics' }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Select a role to simulate the environment
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onLogin({ role: role.id, name: `Test ${role.name}` })}
              className="w-full flex flex-col items-start p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <span className="font-semibold text-slate-900">{role.name}</span>
              <span className="text-xs text-slate-500 mt-1">{role.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;