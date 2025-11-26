import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  const { nlp_analysis_score, final_skill_match_percentage, extracted_skills, gemini_verification } = result;

  const chartData = [
    { name: 'Depth', score: nlp_analysis_score.technical_depth, max: 40, color: '#4f46e5' }, // indigo-600
    { name: 'Diversity', score: nlp_analysis_score.technical_diversity, max: 20, color: '#0ea5e9' }, // sky-500
    { name: 'Relevance', score: nlp_analysis_score.domain_relevance, max: 25, color: '#8b5cf6' }, // violet-500
    { name: 'Impact', score: nlp_analysis_score.achievements_impact, max: 15, color: '#ec4899' }, // pink-500
  ];

  // Determine grade color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Top Section: Overall Score & Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Skill Match Score</h2>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <circle
                className={`${getScoreColor(final_skill_match_percentage)} stroke-current transition-all duration-1000 ease-out`}
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${251.2 * (final_skill_match_percentage / 100)} 251.2`}
              ></circle>
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
              <span className={`text-4xl font-bold ${getScoreColor(final_skill_match_percentage)}`}>
                {final_skill_match_percentage}%
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Verified</span>
            </div>
          </div>
        </div>

        {/* Reasoning Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl"></span> AI Reasoning
          </h3>
          <p className="text-gray-600 leading-relaxed flex-grow">
            {gemini_verification.reasoning}
          </p>
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">NLP Calculated Score:</span>
                <span className="font-medium text-gray-800">{nlp_analysis_score.total_percentage}%</span>
             </div>
             <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">AI Verified Score:</span>
                <span className="font-bold text-indigo-600">{gemini_verification.adjusted_percentage}%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Scoring Breakdown & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rubric Breakdown Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Scoring Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#4b5563'}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {chartData.map((d) => (
               <div key={d.name} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">{d.name}</span>
                  <span className="font-medium" style={{color: d.color}}>{d.score}/{d.max}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Skills Cloud */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Extracted Skills</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
              {result.domain_strength}
            </span>
          </div>
          
          {extracted_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {extracted_skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic text-center mt-10">No specific skills extracted.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl"
        >
          Analyze Another Portfolio
        </button>
      </div>
    </div>
  );
};