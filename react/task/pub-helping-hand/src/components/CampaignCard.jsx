import React from 'react';

const CampaignCard = ({ title, category, targetAmount, raisedAmount, deadline }) => {
  const progress = Math.min((raisedAmount / targetAmount) * 100, 100);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-indigo-200">
            {category}
          </span>
          <span className="text-xs text-slate-500 font-medium">{deadline}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{title}</h3>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1 text-slate-600">
            <span>Raised: <span className="font-semibold text-emerald-600">${raisedAmount}</span></span>
            <span>Target: <span className="font-semibold text-slate-800">${targetAmount}</span></span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button className="mt-5 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-md text-sm font-medium transition-colors">
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;