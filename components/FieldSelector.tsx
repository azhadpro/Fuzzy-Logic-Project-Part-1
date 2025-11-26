import React from 'react';
import { FieldOfStudy } from '../types';

interface FieldSelectorProps {
  selectedField: FieldOfStudy | null;
  onSelect: (field: FieldOfStudy) => void;
}

const fields: { id: FieldOfStudy; label: string; icon: string; desc: string }[] = [
  { 
    id: 'software engineering', 
    label: 'Software Engineering', 
    icon: '💻', 
    desc: 'Algorithms, OOP, Full-stack, APIs' 
  },
  { 
    id: 'network', 
    label: 'Network Engineering', 
    icon: '🌐', 
    desc: 'Routing, Security, Protocols, Monitoring' 
  },
  { 
    id: 'data', 
    label: 'Data Science', 
    icon: '📊', 
    desc: 'SQL, ML, Statistics, Visualization' 
  },
];

export const FieldSelector: React.FC<FieldSelectorProps> = ({ selectedField, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {fields.map((field) => (
        <button
          key={field.id}
          onClick={() => onSelect(field.id)}
          className={`
            relative p-6 rounded-xl text-left transition-all duration-200 border-2
            ${selectedField === field.id 
              ? 'border-indigo-600 bg-indigo-50 shadow-md' 
              : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'}
          `}
        >
          <div className="text-3xl mb-3">{field.icon}</div>
          <h3 className={`font-semibold text-lg ${selectedField === field.id ? 'text-indigo-900' : 'text-gray-900'}`}>
            {field.label}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{field.desc}</p>
          
          {selectedField === field.id && (
            <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};