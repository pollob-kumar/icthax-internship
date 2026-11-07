import React, { useState } from 'react';

const CreateCampaign = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'medical',
    targetAmount: '',
    deadline: '',
    description: '',
    isEmergency: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    alert("Campaign request submitted for verification!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Campaign Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
          <input type="text" name="title" required className="input-field" onChange={handleChange} placeholder="e.g. Tuition fee assistance" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select name="category" className="input-field" onChange={handleChange}>
              <option value="medical">Medical</option>
              <option value="tuition">Tuition</option>
              <option value="disaster relief">Disaster Relief</option>
              <option value="club or event">Club or Event</option>
              <option value="charity">Charity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount (Test Tokens)</label>
            <input type="number" name="targetAmount" required className="input-field" onChange={handleChange} placeholder="0.00" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
          <input type="date" name="deadline" required className="input-field" onChange={handleChange} />
        </div>

        <div className="flex items-center mt-4">
          <input type="checkbox" name="isEmergency" id="isEmergency" onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded" />
          <label htmlFor="isEmergency" className="ml-2 block text-sm text-slate-700">
            Emergency Fund Request (Shorter review window)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Supporting Description</label>
          <textarea name="description" rows="4" className="input-field" onChange={handleChange} placeholder="Explain the situation (documents stored off-chain)"></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full">Submit for Verification</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;