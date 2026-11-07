import React from 'react';

export const BeneficiaryDashboard = ({ navigateTo }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Campaigns</h2>
        <p className="text-sm text-slate-500">Manage your active campaigns and spending requests.</p>
      </div>
      <button onClick={() => navigateTo('create')} className="btn-primary">Request New Campaign</button>
    </div>
    {/* List of their campaigns would go here */}
  </div>
);

export const DonorDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800 mb-4">Donor Dashboard</h2>
    <p className="text-sm text-slate-600 mb-6">Track the use of your donations and download transaction receipts.</p>
    <div className="border border-slate-100 rounded-md overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Campaign</th>
            <th className="px-4 py-3">Amount Donated</th>
            <th className="px-4 py-3">Transaction Hash</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="px-4 py-3 font-medium text-slate-900">Medical Emergency Fund</td>
            <td className="px-4 py-3 text-emerald-600">500 TKN</td>
            <td className="px-4 py-3 font-mono text-xs text-slate-400">0x8f3...a1b2</td>
            <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Spent Properly</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const CommitteeDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800 mb-4">Verification Workflow</h2>
    <p className="text-sm text-slate-600 mb-4">Review pending campaigns and spending requests (k of n approval required).</p>
    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-indigo-900">Flood Relief Request</p>
          <p className="text-xs text-indigo-700">Category: Disaster Relief | Target: 10000 TKN</p>
        </div>
        <div className="space-x-2">
          <button className="btn-success text-xs">Approve & Badge</button>
          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-xs transition-colors">Reject</button>
        </div>
      </div>
    </div>
  </div>
);

export const AdminDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800 mb-4">Auditor Analytics</h2>
    <p className="text-sm text-slate-600 mb-4">Campaign priority ranking based on urgency, deadline, and funding gap.</p>
    {/* Analytics charts/tables would go here */}
    <div className="h-32 bg-slate-50 flex items-center justify-center border border-dashed border-slate-300 rounded">
      <span className="text-slate-400 text-sm">Analytics View Placeholder</span>
    </div>
  </div>
);